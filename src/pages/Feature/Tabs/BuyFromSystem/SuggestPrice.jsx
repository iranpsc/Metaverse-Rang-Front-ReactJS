import { useState, useContext } from "react";
import styled from "styled-components";
import FillInputs from "./FillInputs";
import ResultInfo from "../../../components/ResultInfo";
import { FeatureContext } from "../../../Context/FeatureProvider";
import { FeaturePrice } from "../../../../../services/constants/FeatureType";
import {
  ToastSuccess,
  ToastError,
} from "../../../../../services/Utility";
import useRequest from "../../../../hooks/useRequest.js";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: red;
  gap: 30px;
  width: 100%;
  @media (max-width: 1024px) {
    height: 62vh !important;
    overflow: auto;
  }
  @media (min-width: 1025px) {
    height: auto !important;
  }
`;

const Text = styled.p`
  color: #ffffff;
  line-height: 1.5rem;

  font-weight: 100;
`;

const SuggestPrice = () => {
  const [feature] = useContext(FeatureContext);
  const { Request, HTTP_METHOD } = useRequest();

  const [assign, setAssign] = useState(false);
  const [rial, setRial] = useState("");
  const [psc, setPsc] = useState("");
  const [suggestText, setSuggestText] = useState("");
  const [errors, setErrors] = useState({});

  const totalArea = feature?.properties?.density * feature?.properties?.area;
  const totalIrr =
    totalArea *
    FeaturePrice(feature?.properties?.rgb) *
    (feature?.properties?.minimum_price_percentage / 100);

  const handleSubmit = () => {
    const totalPrice = parseFloat(rial) + parseFloat(psc) * 900;

    if (totalPrice >= totalIrr) {
      Request(`buy-requests/store/${feature?.id}`, HTTP_METHOD.POST, {
        price_irr: parseFloat(rial),
        price_psc: parseFloat(psc),
        note: suggestText,
      })
        .then(() => {
          ToastSuccess("پیشنهاد شما با موفقیت ارسال گردید.");
          setAssign(true);
        })
        .catch((error) => {
            ToastError(error.response.data.message);
  
        });
    } else {
      setErrors({
        price: `حداقل ارزش معامله ${feature?.properties?.minimum_price_percentage}% قیمت اولیه میباشد`,
      });
    }
  };

  return (
    <Wrapper>
      <Text>قیمت پیشنهادی شما</Text>
      {!assign && (
        <FillInputs
          rial={rial}
          psc={psc}
          setRial={setRial}
          setPsc={setPsc}
          suggestText={suggestText}
          setSuggestText={setSuggestText}
          onSubmit={handleSubmit}
          errors={errors}
          totalIrr={totalIrr}
          remainingAmount={totalIrr - rial - psc * 900}
        />
      )}
      {assign && <ResultInfo rial={rial} psc={psc} setAssign={setAssign} />}
    </Wrapper>
  );
};

export default SuggestPrice;
