import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router";
import {
  WalletContext,
} from "../../../../services/reducers/WalletContext";
import useWalletUpdate from "../../../../hooks/useWalletUpdate.js";
import { FeatureContext } from "../../Context/FeatureProvider";
import Button from "../../../../components/Button";
import useRequest from "../../../../hooks/useRequest.js";
import {
  FeatureColor,
  FeatureSvg,
} from "../../../../services/constants/FeatureType.jsx";
import { getTranslation, ToastError } from "../../../../services/Utility";
import TitleValue from "../../../../components/TitleValue.jsx";
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
  const [wallet] = useContext(WalletContext);
  const updateWallet = useWalletUpdate();
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
        updateWallet(colorKey, Number(featurePrice), "-");

        Navigate(FeatureSvg(feature.properties.rgb));
      })
      .catch((error) => {
        ToastError(error?.response?.data?.message || "خطای غیرمنتظره");
      });
  };
  return (
    <>
      <InputsWrapper>
        <TitleValue
          full
          title={getTranslation("521")}
          value={feature.properties.stability}
          valueIcon={FeatureColor(feature.properties.rgb)}
        />
      </InputsWrapper>

      <Button label={getTranslation("353")} onclick={onSubmit} />
    </>
  );
};

export default SellerPriceInfo;
