import { useState, useContext, useMemo, useEffect } from "react";
import styled from "styled-components";
import FillInputs from "./FillInputs";
import ResultInfo from "../../../components/ResultInfo";
import { FeatureContext } from "../../../Context/FeatureProvider";
import { FeaturePrice } from "../../../../../services/constants/FeatureType";
import {
  ToastSuccess,
  ToastError,
  getTranslation,
  calculateFee,
} from "../../../../../services/Utility";
import useRequest from "../../../../../hooks/useRequest.js";
import BaseContainer from "../../../../../components/Common/Container";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../../services/reducers/WalletContext";

const Wrapper = styled(BaseContainer)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 30px;
  padding-top: 20px;

  p {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    line-height: 1.5rem;
  }
`;

const PSC_RATE = 900;

const SuggestPrice = () => {
  const [wallet, dispatch] = useContext(WalletContext);
  const [feature] = useContext(FeatureContext);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const walletState = wallet ?? {};

  const totalIrr = useMemo(() => {
    if (!feature?.properties) return 0;

    const {
      stability = 0,
      rgb,
      minimum_price_percentage = 0,
    } = feature.properties;

    return (
      Number(stability || 0) *
      Number(FeaturePrice(rgb) || 0) *
      (Number(minimum_price_percentage || 0) / 100)
    );
  }, [feature]);

  const [assign, setAssign] = useState(false);
  const [rial, setRial] = useState(0);
  const [psc, setPsc] = useState(0);
  const [suggestText, setSuggestText] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!totalIrr) {
      setRial(0);
      setPsc("");
      return;
    }

    const initialRial = totalIrr / 2;
    setRial(initialRial);
    setPsc(String(initialRial / PSC_RATE));
  }, [totalIrr]);

  const rialValue = Number(rial) || 0;
  const pscValue = Number(psc || 0) || 0;

  const totalPrice = useMemo(
    () => rialValue + pscValue * PSC_RATE,
    [rialValue, pscValue],
  );

  const validate = () => {
    if (totalPrice < totalIrr) {
      return `حداقل ارزش معامله ${feature?.properties?.minimum_price_percentage}% قیمت اولیه میباشد`;
    }

    if (rialValue > (walletState?.irr ?? 0)) {
      return getTranslation("1604");
    }

    if (pscValue > (walletState?.psc ?? 0)) {
      return getTranslation("1605");
    }

    return null;
  };

  const handleSubmit = () => {
    setErrors({});

    const errorMessage = validate();
    if (errorMessage) {
      ToastError(errorMessage);
      return;
    }

    if (!checkSecurity()) return;

    Request(`buy-requests/store/${feature?.id}`, HTTP_METHOD.POST, {
      price_irr: rialValue,
      price_psc: pscValue,
      note: suggestText.trim(),
    })
      .then(() => {
        ToastSuccess(getTranslation("1607"));

        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: {
            ...walletState,
            irr: (walletState?.irr ?? 0) - calculateFee(rialValue),
            psc: (walletState?.psc ?? 0) - calculateFee(pscValue),
          },
        });

        setAssign(true);
      })
      .catch((error) => {
        ToastError(error?.response?.data?.message || "خطای غیرمنتظره");
      });
  };

  return (
    <Wrapper>
      <p>{getTranslation("527")}</p>

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
        />
      )}

      {assign && (
        <ResultInfo rial={rialValue} psc={pscValue} setAssign={setAssign} />
      )}
    </Wrapper>
  );
};

export default SuggestPrice;
