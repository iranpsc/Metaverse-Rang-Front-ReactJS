import Rial from "../../../../../components/Rial";
import Psc from "../../../../../components/Psc";
import Input from "../../../../../components/Input";

import styled from "styled-components";
import { useContext, useState } from "react";
import Button from "../../../../../components/Button";
import TitleValue from "../../../../../components/TitleValue";
import { FeatureContext } from "../../../Context/FeatureProvider";
import { useNavigate } from "react-router";
import useRequest from "../../../../../hooks/useRequest.js";
import { FeatureSvg } from "../../../../../services/constants/FeatureType";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../../services/reducers/WalletContext";
import {
  calculateFee,
  getTranslation,
  ToastError,
  formatNumber,
} from "../../../../../services/Utility";

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  gap: 20px;
  @media (min-width: 600px) {
    padding-left: 0;
    flex-direction: row;
  }
`;

const ResultWrapper = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: 2fr 1fr;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 4fr 1fr;
  }
`;

const SellerPriceInfo = () => {
  const [feature] = useContext(FeatureContext);
  const [wallet, dispatch] = useContext(WalletContext);
  const [rial, setRial] = useState(feature.properties.price_irr);
  const [psc, setPsc] = useState(feature.properties.price_psc);
  const Navigate = useNavigate();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const onSubmit = () => {
    try {
      const walletPscRaw = wallet?.psc || 0;
      const walletIrrRaw = wallet?.irr || 0;

      const psclastRaw = walletPscRaw - calculateFee(psc, 5);
      const irrlastRaw = walletIrrRaw - calculateFee(rial, 5);

      if (psclastRaw < 0) {
        ToastError(getTranslation("1605"));
        return;
      }
      if (irrlastRaw < 0) {
        ToastError(getTranslation("1604"));
        return;
      }
      if (!checkSecurity()) return;

      Request(`features/buy/${feature?.id}`, HTTP_METHOD.POST)
        .then(() => {
          dispatch({
            type: WalletContextTypes.ADD_WALLET,
            payload: {
              ...wallet,

              psc: psclastRaw,
              irr: irrlastRaw,
            },
          });

          Navigate(FeatureSvg(feature?.properties?.rgb));
        })
        .catch((error) => {
          ToastError(error?.response?.data?.message || "خطای سرور");
        });
    } catch (error) {
      ToastError(error?.response?.data?.message || "خطای محاسباتی");
    }
  };

  return (
    <>
      <InputsWrapper>
        <Input
          value={rial}
          onchange={(e) => setRial(e.target.value)}
          type="number"
          placeholder={`${getTranslation(
            "521",
          )} (${getTranslation("48")})`}
          insideText={<Rial />}
          disabled
        />
        <Input
          value={formatNumber(psc)}
          onchange={(e) => setPsc(e.target.value)}
          type="number"
          placeholder={`${getTranslation(
            "521",
          )} (${getTranslation("47")})`}
          insideText={<Psc />}
          disabled
        />
      </InputsWrapper>
      <ResultWrapper>
        <TitleValue
          title={getTranslation("522")}
          value={`${calculateFee(rial, 5)} ${getTranslation(
            "48",
          )} / ${calculateFee(psc, 5)} ${getTranslation("47")}`}
        />
        <TitleValue title={getTranslation("523")} value="5%" />
      </ResultWrapper>
      {(Number(psc) !== 0 || Number(rial) !== 0) && (
        <div>
          <Button
            label={getTranslation("353")}
            onClick={onSubmit}
          />
        </div>
      )}
    </>
  );
};

export default SellerPriceInfo;
