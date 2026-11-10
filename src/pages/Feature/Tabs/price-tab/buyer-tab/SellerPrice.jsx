// صفحه‌ی خرید ملک از فروشنده با قیمت ثابت (قیمت ریال و PSC، کارمزد ۵٪ و مبلغ نهایی) و دکمه‌ی خرید که کارمزد را از کیف پول کم می‌کند؛ مناسب مسیر buy/price در صفحه‌ی ملک

import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router";
import Button from "../../../../../components/Button";
import Container from "../../../../../components/Common/Container";
import WalletAsset from "../../../../../components/WalletAsset.jsx";
import TitleValue from "../../../../../components/TitleValue";
import useRequest from "../../../../../hooks/useRequest.js";
import useWalletUpdate from "../../../../../hooks/useWalletUpdate.js";
import { FeatureSvg } from "../../../../../services/constants/FeatureType";
import { WalletContext } from "../../../../../services/reducers/WalletContext";
import {
  calculateFee,
  formatNumber,
  getTranslation,
  ToastError,
} from "../../../../../services/Utility";
import { FeatureContext } from "../../../Context/FeatureProvider";
import TitleBody from "../../../../../components/TitleBody.jsx";
import LabeledInput from "../../../../../components/LabeledInput.jsx";
const FEE_PERCENT = 5;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding-top: 20px;
  overflow-y: auto;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;

  @media (min-width: 600px) {
    flex-direction: row;
    padding-left: 0;
  }
`;

const Results = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: 3fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 4fr 1fr;
  }
`;

const SellerPrice = () => {
  const [feature] = useContext(FeatureContext);
  const [wallet] = useContext(WalletContext);
  const updateWallet = useWalletUpdate();
  const navigate = useNavigate();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const { price_irr: rial, price_psc: psc, rgb } = feature.latest_sell_request;
  // مبلغ نهایی هر ارز بعد از اضافه شدن کارمزد
  const total = {
    irr: calculateFee(rial, FEE_PERCENT),
    psc: calculateFee(psc, FEE_PERCENT),
  };
  const handleBuy = () => {
    const irrAfter = (wallet?.irr || 0) - total.irr;
    const pscAfter = (wallet?.psc || 0) - total.psc;

    if (pscAfter < 0) return ToastError(getTranslation("1605"));
    if (irrAfter < 0) return ToastError(getTranslation("1604"));
    if (!checkSecurity()) return;

    Request(`features/buy/${feature?.id}`, HTTP_METHOD.POST)
      .then(() => {
        updateWallet("psc", total.psc, "-");
        updateWallet("irr", total.irr, "-");
        navigate(FeatureSvg(rgb));
      })
      
  };

  return (
    <Container>
      <Wrapper>
        <TitleBody title={getTranslation("526")} />

        <Inputs>
          <LabeledInput
            disabled
            type="number"
            value={formatNumber(rial)}
            placeholder={`${getTranslation("521")} (${getTranslation("48")})`}
            suffix={<WalletAsset asset="irr" showLabel />}
          />
          <LabeledInput
            disabled
            type="number"
            value={formatNumber(psc)}
            placeholder={`${getTranslation("521")} (${getTranslation("47")})`}
            suffix={<WalletAsset asset="psc" showLabel />}
          />
        </Inputs>

        <Results>
          <TitleValue
            title={getTranslation("522")}
            value={`${total.irr} ${getTranslation("48")} / ${total.psc} ${getTranslation("47")}`}
          />
          <TitleValue title={getTranslation("523")} value={`${FEE_PERCENT}%`} />
        </Results>

        <Button fit label={getTranslation("353")} onClick={handleBuy} />
      </Wrapper>
    </Container>
  );
};

export default SellerPrice;
