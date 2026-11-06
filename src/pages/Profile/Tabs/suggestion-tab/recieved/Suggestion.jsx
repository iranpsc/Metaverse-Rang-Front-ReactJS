// Suggestion.jsx
import { useCallback, useMemo, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { useNavigate } from "react-router";
import styled from "styled-components";

import blue from "../../../../../assets/images/profile/blue-color.gif";
import psc from "../../../../../assets/images/profile/psc.gif";
import red from "../../../../../assets/images/profile/red-color.gif";
import rial from "../../../../../assets/images/profile/rial.gif";
import yellow from "../../../../../assets/images/profile/yellow-color.gif";

import SuggestionSkeleton from "../../../../../components/Skeletons/SuggestionSkeleton";
import TitleBody from "../../../../../components/TitleBody.jsx";
import { useIsRtl } from "../../../../../hooks/useLanguageContext.js";
import {
  convertToPersian,
  getTranslation,
  calculateTotalIrr,
  calculateFallbackPriceIrr,
} from "../../../../../services/Utility/index";
import { calculatePolygonCentroid } from "../../../../../services/Utility/calculatePolygonCentroid";
import { flyToMapPosition } from "../../../../../services/Utility/flyToMapPosition";
import { getPolygonShape } from "../../../../../services/Utility/getPolygonShape";
import LandText from "../../../../../components/LandText.jsx";
import {
  AreaContainer,
  Location,
  Polygon,
  Property,
  StyledSVG,
  Suggestions,
  SuggestionsContainer,
  Value,
} from "../suggestionStyles";
import Proposer from "./Proposer";

const KARBARI_ICONS = { m: yellow, t: red, a: blue };
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

const LocationLink = styled.div`
  cursor: pointer;
`;

const PriceItem = ({ src, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
    <img width={24} height={24} src={src} alt="" />
    <TitleBody title={convertToPersian(value)} />
  </div>
);

const Suggestion = ({ item, isLoading }) => {
  const [removed, setRemoved] = useState(false);
  const isPersian = useIsRtl();
  const navigate = useNavigate();
  const mapRef = useMap();

  const coordinates = item?.feature_coordinates;

  const { points, viewBox } = useMemo(
    () => getPolygonShape(coordinates),
    [coordinates],
  );

  const handleRemoved = useCallback(() => setRemoved(true), []);

  const handleLocation = useCallback(() => {
    if (!coordinates?.length) return;

    const { x, y } = calculatePolygonCentroid(coordinates);
    flyToMapPosition({ latitude: y, longitude: x, mapRef, zoom: 17 });
    navigate("/");
  }, [coordinates, mapRef, navigate]);

  if (isLoading) return <SuggestionSkeleton variant="received" />;
  if (removed || !item) return null;

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
        <Location>
          <AreaContainer>
            <StyledSVG viewBox={viewBox}>
              <Polygon karbari={feature.karbari} points={points} />
            </StyledSVG>
          </AreaContainer>
          <div>
            <TitleBody title={feature.address} />
            <LandText
              label={feature.id}
              to={`/feature/${item?.feature_id}/info`}
            />
            <LocationLink onClick={handleLocation}></LocationLink>
          </div>
        </Location>

        <Pricing>
          <Value>
            <TitleBody gray title={getTranslation("767")} />
            <div>
              {karbariIcon && (
                <img width={24} height={24} src={karbariIcon} alt="" />
              )}
              <TitleBody title={convertToPersian(feature.stability || 0)} />
            </div>
          </Value>

          <div>
            <TitleBody gray title={getTranslation("770")} />
            {hasPrice ? (
              <Prices $isPersian={isPersian}>
                <PriceItem src={rial} value={price_irr} />
                <PriceItem src={psc} value={price_psc} />
              </Prices>
            ) : (
              <PriceItem src={rial} value={finalPrice} />
            )}
          </div>
        </Pricing>
      </Property>

      <Suggestions>
        <Proposer
          item={item}
          onRemoved={handleRemoved}
          finalPrice={finalPrice}
        />
      </Suggestions>
    </SuggestionsContainer>
  );
};

export default Suggestion;
