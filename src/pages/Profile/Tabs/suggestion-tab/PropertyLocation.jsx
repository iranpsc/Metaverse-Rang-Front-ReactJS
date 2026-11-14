// بخش مکان ملک در کارت پیشنهاد (شکل چندضلعی، آدرس و لینک ملک)؛ مناسب کارت پیشنهادهای دریافتی و ارسالی
import { useMemo } from "react";
import LandText from "../../../../components/LandText";
import TitleBody from "../../../../components/TitleBody";
import { getPolygonShape } from "../../../../services/Utility/getPolygonShape";
import { AreaContainer, Location, Polygon, StyledSVG } from "./suggestionStyles";

const PropertyLocation = ({ item }) => {
  const feature = item.feature_properties || {};
  const { points, viewBox } = useMemo(
    () => getPolygonShape(item.feature_coordinates),
    [item.feature_coordinates],
  );

  return (
    <Location>
      <AreaContainer>
        <StyledSVG viewBox={viewBox}>
          <Polygon karbari={feature.karbari} points={points} />
        </StyledSVG>
      </AreaContainer>
      <div>
        <TitleBody title={feature.address} />
        <LandText label={feature.id} to={`/feature/${item.feature_id}/info`} />
      </div>
    </Location>
  );
};

export default PropertyLocation;