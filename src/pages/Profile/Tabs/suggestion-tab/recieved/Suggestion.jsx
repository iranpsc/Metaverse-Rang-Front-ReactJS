// Suggestion.jsx
import Proposer from "./Proposer";
import { useMap } from "react-map-gl/maplibre";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { useMemo, useState } from "react";
import {
  SuggestionsContainer,
  Location,
  Property,
  Value,
  Suggestions,
  AreaContainer,
  StyledSVG,
  Polygon,
} from "../suggestionStyles";
import {
  getTranslation,
  convertToPersian,
} from "../../../../../services/Utility/index";
import { useLanguage } from "../../../../../services/reducers/LanguageContext";
import { calculatePolygonCentroid } from "../../../../../services/Utility/calculatePolygonCentroid";
import { flyToMapPosition } from "../../../../../services/Utility/flyToMapPosition";
import { getPolygonShape } from "../../../../../services/Utility/getPolygonShape";
import { Skeleton } from "../../../../../components/Skeleton";
import yellow from "../../../../../assets/images/profile/yellow-color.gif";
import red from "../../../../../assets/images/profile/red-color.gif";
import blue from "../../../../../assets/images/profile/blue-color.gif";
import rial from "../../../../../assets/images/profile/rial.gif";
import psc from "../../../../../assets/images/profile/psc.gif";

const Container = SuggestionsContainer;

const Pricing = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  @media (min-width: 840px) {
    gap: 120px;
  }
`;

const Price = styled.div`
  h2 {
    color: #a0a0ab;
    font-size: 14px;
    font-weight: 600;
  }
`;

const Prices = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  ${({ isPersian }) =>
    isPersian ? "margin-left: 70px;" : "margin-right: 70px;"};
  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  span {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 18px;
    font-weight: 500;
  }
`;

const SkeletonSuggestion = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const KARBARI_ICONS = { m: yellow, t: red, a: blue };

const Suggestion = ({ item, isLoading }) => {
  const [removed, setRemoved] = useState(false);
  const isPersian = useLanguage();
  const navigate = useNavigate();
  const mapRef = useMap();

  const coordinates = item?.feature_coordinates;
  const { points, viewBox, hasXGreaterThan50 } = useMemo(
    () => getPolygonShape(coordinates),
    [coordinates],
  );

  if (isLoading) {
    return (
      <SkeletonSuggestion>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Skeleton width="100px" height="100px" radius="10px" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
                gap: "18px",
              }}
            >
              <Skeleton width="70px" height="20px" radius="4px" />
              <Skeleton width="60px" height="16px" radius="4px" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginBottom: "20px",
              marginInlineEnd: "35px",
            }}
          >
            <Skeleton width="80px" height="40px" radius="8px" />
            <Skeleton width="120px" height="40px" radius="8px" />
          </div>
        </div>
        <Skeleton width="100%" height="300px" radius="10px" />
      </SkeletonSuggestion>
    );
  }

  if (removed || !item) return null;

  const feature = item.feature_properties || {};

  const handleLocation = () => {
    if (!coordinates?.length) return;
    const center = calculatePolygonCentroid(coordinates);
    flyToMapPosition({
      latitude: center.y,
      longitude: center.x,
      mapRef,
      zoom: 17,
    });
    navigate("/");
  };

  return (
    <Container>
      <Property>
        <Location>
          <AreaContainer>
            <StyledSVG viewBox={viewBox}>
              <Polygon
                karbari={feature.karbari}
                hasXGreaterThan50={hasXGreaterThan50}
                points={points}
              />
            </StyledSVG>
          </AreaContainer>
          <div>
            <p>{feature.address}</p>
            <h3 onClick={handleLocation}>
              {feature.id?.toString?.().toUpperCase?.()}
            </h3>
          </div>
        </Location>
        <Pricing>
          <Value>
            <h2>{getTranslation("767")}</h2>
            <div>
              {feature.karbari && (
                <img
                  width={24}
                  height={24}
                  src={KARBARI_ICONS[feature.karbari]}
                  alt=""
                />
              )}
              <span>{convertToPersian(feature.stability || 0)}</span>
            </div>
          </Value>
          <Price>
            <h2>{getTranslation("770")}</h2>
            <Prices isPersian={isPersian}>
              <div>
                <img width={24} height={24} src={rial} alt="" />
                <span>{convertToPersian(item.price_irr)}</span>
              </div>
              <div>
                <img width={24} height={24} src={psc} alt="" />
                <span>{convertToPersian(item.price_psc)}</span>
              </div>
            </Prices>
          </Price>
        </Pricing>
      </Property>
      <Suggestions>
        <Proposer item={item} onRemoved={() => setRemoved(true)} />
      </Suggestions>
    </Container>
  );
};

export default Suggestion;