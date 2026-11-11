// کارت پیشنهاد خرید دریافتی؛ مناسب لیست پیشنهادهای دریافتی مالک (ملک، قیمت ثبت‌شده و Proposer با رد/قبول)
import { useCallback, useState } from "react";
import styled from "styled-components";

import TitleBody from "../../../../../components/TitleBody.jsx";
import { useIsRtl } from "../../../../../services/reducers/LanguageContext.jsx";
import {
  convertToPersian,
  getTranslation,
  calculateTotalIrr,
  calculateFallbackPriceIrr,
} from "../../../../../services/Utility/index";
import { Property, Suggestions, SuggestionsContainer, Value } from "../suggestionStyles";
import PropertyLocation from "../PropertyLocation";
import Proposer from "./Proposer";
import { COLOR_CONFIG } from "../../../../../services/constants/colorConfig.js";

const KARBARI_ICONS = {
  m: COLOR_CONFIG.yellow.gif,
  t: COLOR_CONFIG.red.gif,
  a: COLOR_CONFIG.blue.gif,
};

const Pricing = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;

  @media (min-width: 840px) {
    gap: 120px;
  }
`;

const Prices = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ $isPersian }) =>
    $isPersian ? "margin-left: 70px;" : "margin-right: 70px;"}

  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const PriceItem = ({ src, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
    <img width={24} height={24} src={src} alt="" />
    <TitleBody title={convertToPersian(value)} />
  </div>
);

const Suggestion = ({ item }) => {
  const [removed, setRemoved] = useState(false);
  const isPersian = useIsRtl();
  const handleRemoved = useCallback(() => setRemoved(true), []);

  if (removed) return null;

  const feature = item.feature_properties || {};
  const karbariIcon = KARBARI_ICONS[feature.karbari];
  const { price_irr, price_psc, stability, karbari } = feature;

  const registeredPrice = calculateTotalIrr(price_irr, price_psc);
  const hasPrice = registeredPrice > 0;

  // قیمت نهایی (ریال) برای مقایسه با پیشنهاد خریدار
  const finalPrice = hasPrice
    ? registeredPrice
    : calculateFallbackPriceIrr(karbari, stability);

  return (
    <SuggestionsContainer>
      <Property>
        <PropertyLocation item={item} />

        <Pricing>
          <Value>
            <TitleBody gray title={getTranslation("767")} />
            <div>
              {karbariIcon && <img width={24} height={24} src={karbariIcon} alt="" />}
              <TitleBody title={convertToPersian(stability || 0)} />
            </div>
          </Value>

          <div>
            <TitleBody gray title={getTranslation("770")} />
            {hasPrice ? (
              <Prices $isPersian={isPersian}>
                <PriceItem src={COLOR_CONFIG.irr.gif} value={price_irr} />
                <PriceItem src={COLOR_CONFIG.psc.gif} value={price_psc} />
              </Prices>
            ) : (
              <PriceItem src={COLOR_CONFIG.irr.gif} value={finalPrice} />
            )}
          </div>
        </Pricing>
      </Property>

      <Suggestions>
        <Proposer item={item} onRemoved={handleRemoved} finalPrice={finalPrice} />
      </Suggestions>
    </SuggestionsContainer>
  );
};

export default Suggestion;