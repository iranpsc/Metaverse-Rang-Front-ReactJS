import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../services/reducers/WalletContext";
import TextValueIcon from "../../../../components/TextValueIcon";
import { FeatureContext } from "../../Context/FeatureProvider";
import Button from "../../../../components/Button";
import useRequest from "../../../../hooks/useRequest.js";
import {
  FeatureColor,
  FeatureSvg,
} from "../../../../services/constants/FeatureType";
import { getTranslation, ToastError } from "../../../../services/Utility";
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

const SellerPriceInfo = () => {
  const [wallet, dispatch] = useContext(WalletContext);
  const [feature] = useContext(FeatureContext);

  const Navigate = useNavigate();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const onSubmit = () => {
    const colorKey =
      feature.properties.karbari === "m"
        ? "yellow"
        : feature.properties.karbari === "t"
          ? "red"
          : feature.properties.karbari === "a"
            ? "blue"
            : null;

    const walletRaw = wallet[colorKey] || "0";
    const featurePrice = feature.properties.stability || "0";
    if (walletRaw < featurePrice) {
      const colorName =
        colorKey === "yellow"
          ? getTranslation("1599")
          : colorKey === "red"
            ? getTranslation("1600")
            : colorKey === "blue"
              ? getTranslation("1601")
              : "نامشخص";

      ToastError(colorName);
      return;
    }
    if (!checkSecurity()) return;
    Request(`features/buy/${feature.id}`, HTTP_METHOD.POST)
      .then(() => {
        const newAmount = walletRaw - featurePrice;

        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: {
            ...wallet,
            [colorKey]: newAmount,
          },
        });
      
        Navigate(FeatureSvg(feature.properties.rgb));
      })
      .catch((error) => {
        ToastError(error?.response?.data?.message || "خطای غیرمنتظره");
      });
  };
  return (
    <>
      <InputsWrapper>
        <TextValueIcon
          title={getTranslation("521")}
          value={feature.properties.stability}
          valueIcon={FeatureColor(feature.properties.rgb)}
          very_long
        />
      </InputsWrapper>

      <Button label={getTranslation("353")} onclick={onSubmit} />
    </>
  );
};

export default SellerPriceInfo;
