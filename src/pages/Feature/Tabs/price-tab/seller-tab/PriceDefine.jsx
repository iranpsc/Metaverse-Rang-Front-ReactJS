import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import FillInputs from "./FillInputs";
import ResultInfo from "../../../components/ResultInfo";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
  formatNumber,
  sanitizePriceInputValue,
} from "../../../../../services/Utility";
import useRequest from "../../../../../hooks/useRequest.js";
import { FeatureContext } from "../../../Context/FeatureProvider";
import Container from "../../../../../components/Common/Container";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
`;

const Text = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  line-height: 1.6rem;
  font-size: 16px;
`;

const sanitizePriceSubmitValue = (value) => {
  const sanitized = sanitizePriceInputValue(value);

  if (sanitized === "") {
    return null;
  }

  const number = Number(sanitized);
  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return number;
};

const PriceDefine = () => {
  const [feature, setFeature] = useContext(FeatureContext);

  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const [data, setData] = useState(null);
  const [assign, setAssign] = useState(false);

  const [rial, setRial] = useState(
    data?.price_irr||0
  );

  const [psc, setPsc] = useState(
    data?.price_psc||0
  );

  const [errors, setErrors] = useState({
    rial: "",
    psc: "",
  });



  useEffect(() => {
    Request("sell-requests")
      .then((res) => {
        const sellRequests = res?.data?.data || [];

        const currentSellRequest = sellRequests.find(
          (item) => Number(item.feature_id) === Number(feature?.id)
        );

        setData(currentSellRequest || null);
        setAssign(!!currentSellRequest);

        if (currentSellRequest) {
          setRial(currentSellRequest.price_irr || 0);
          setPsc(currentSellRequest.price_psc || 0);
        }
      })
      .catch((error) => {
        console.error("Error fetching sell requests:", error);
      });
  }, [feature?.id]);

  const validateAndSubmit = () => {
    setErrors({
      rial: "",
      psc: "",
    });

    const normalizedRial = sanitizePriceSubmitValue(rial);
    const normalizedPsc = sanitizePriceSubmitValue(psc);

    if (normalizedRial === null || normalizedPsc === null) {
      ToastError("مقدار وارد شده معتبر نیست.");
      return;
    }

    const formData = {
      price_irr: normalizedRial,
      price_psc: normalizedPsc,
    };

    if (!checkSecurity()) return;

    Request(
      `sell-requests/store/${feature?.id}`,
      HTTP_METHOD.POST,
      formData
    )
      .then(() => {
        ToastSuccess(getTranslation(1650));

        setAssign(true);

        setFeature((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            price_irr: formData.price_irr,
            price_psc: formData.price_psc,
          },
        }));
      })
      .catch((error) => {
           ToastError(error.response.data.message);
      });
  };

  return (
    <Container>
      <Wrapper>
        <Text>{getTranslation("520")}</Text>

        {!assign && (
          <FillInputs
            rial={rial}
            setRial={setRial}
            psc={psc}
            setPsc={setPsc}
            validateAndSubmit={validateAndSubmit}
            errors={errors}
            setAssign={setAssign}
          />
        )}

        {assign && (
          <ResultInfo
            rial={formatNumber(rial)}
            setRial={setRial}
            psc={formatNumber(psc)}
            setPsc={setPsc}
            setAssign={setAssign}
            id={data?.id}
          />
        )}
      </Wrapper>
    </Container>
  );
};

export default PriceDefine;