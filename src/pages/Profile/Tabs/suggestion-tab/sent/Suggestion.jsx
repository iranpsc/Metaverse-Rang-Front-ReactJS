// کارت پیشنهاد خرید ارسالی؛ مناسب لیست پیشنهادهای ارسالی خریدار (ملک، تاریخ، فروشنده و Proposer با شمارش معکوس و لغو)
import { useCallback, useState } from "react";
import styled from "styled-components";

import TitleBody from "../../../../../components/TitleBody";
import UserCode from "../../../../../components/UserCode";
import { convertToPersian, getTranslation } from "../../../../../services/Utility";
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 1366px) {
    gap: 120px;
    width: auto;
    flex-direction: row-reverse;
  }
`;

const Time = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.newColors.shades[30]};
    font-size: 18px;
    font-weight: 500;
    margin-top: 4px;
  }

  @media (min-width: 1366px) {
    margin-left: 70px;
  }
`;

const Suggestion = ({ item }) => {
  const [removed, setRemoved] = useState(false);
  const handleRemoved = useCallback(() => setRemoved(true), []);

  if (removed) return null;

  const { created_at, seller } = item;
  const feature = item.feature_properties || {};
  const karbariIcon = KARBARI_ICONS[feature.karbari];

  return (
    <SuggestionsContainer>
      <Property>
        <PropertyLocation item={item} />

        <Pricing>
          <Time>
            <TitleBody gray title={getTranslation("769")} />
            <TitleBody title={convertToPersian(created_at)} />
          </Time>

          <Value>
            <TitleBody gray title={getTranslation("767")} />
            <div>
              {karbariIcon && <img width={24} height={24} src={karbariIcon} alt="" />}
              <TitleBody title={convertToPersian(feature.stability)} />
            </div>
          </Value>

          <div>
            <TitleBody gray title={getTranslation("346")} />
            <UserCode code={seller?.code} />
          </div>
        </Pricing>
      </Property>

      <Suggestions>
        <Proposer item={item} onRemoved={handleRemoved} />
      </Suggestions>
    </SuggestionsContainer>
  );
};

export default Suggestion;