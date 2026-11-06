// Suggestion.jsx
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import red from "../../../../../assets/images/profile/red-color.gif";
import yellow from "../../../../../assets/images/profile/yellow-color.gif";
import blue from "../../../../../assets/images/profile/blue-color.gif";

import LandText from "../../../../../components/LandText";
import SuggestionSkeleton from "../../../../../components/Skeletons/SuggestionSkeleton";
import TitleBody from "../../../../../components/TitleBody";
import UserCode from "../../../../../components/Usercode";
import {
  convertToPersian,
  getTranslation,
} from "../../../../../services/Utility";
import { getPolygonShape } from "../../../../../services/Utility/getPolygonShape";
import {
  AreaContainer,
  Location,
  Polygon,
  Property,
  StyledSVG,
  SuggestionsContainer,
  Suggestions,
  Value,
} from "../suggestionStyles";
import Proposer from "./Proposer";

const KARBARI_ICONS = { m: yellow, t: red, a: blue };

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

const Suggestion = ({ item, isLoading }) => {
  const [removed, setRemoved] = useState(false);

  const { points, viewBox } = useMemo(
    () => getPolygonShape(item?.feature_coordinates),
    [item?.feature_coordinates],
  );

  const handleRemoved = useCallback(() => setRemoved(true), []);

  if (isLoading) return <SuggestionSkeleton variant="sent" />;
  if (removed || !item) return null;

  const { feature_id, created_at, seller } = item;
  const feature = item.feature_properties || {};
  const karbariIcon = KARBARI_ICONS[feature.karbari];

  return (
    <SuggestionsContainer>
      <Property>
        <Location>
          <AreaContainer>
            <StyledSVG viewBox={viewBox}>
              <Polygon karbari={feature.karbari} points={points} />
            </StyledSVG>
          </AreaContainer>
          <div>
            <TitleBody title={feature.address} />
            <LandText label={feature.id} to={`/feature/${feature_id}/info`} />
          </div>
        </Location>

        <Pricing>
          <Time>
            <TitleBody gray title={getTranslation("769")} />
            <TitleBody title={convertToPersian(created_at)} />
          </Time>

          <Value>
            <TitleBody gray title={getTranslation("767")} />
            <div>
              {karbariIcon && (
                <img width={24} height={24} src={karbariIcon} alt="" />
              )}
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
