// نمایش شکل دوبعدی (چندضلعی SVG) زمین یک ملک از روی مختصات؛ مناسب کارت‌ها و صفحات اطلاعات ملک که پیش‌نمایش شکل زمین لازم دارند
import styled from "styled-components";
import { useMemo } from "react";
import vector from "../../../../../assets/images/profile/Vector.png";
import { getPolygonShape } from "../../../../../services/Utility/getPolygonShape";

const AreaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: #2c2c2c;
  background-image: url(${vector});
  background-size: auto;
  height: 35vh;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;

const Polygon = styled.polygon`
  fill: #fae52b;
  stroke-width: 1;
`;

const Model3D = ({ data }) => {
  const coordinates = data?.["dynasty-feature"]?.coordinates;
  const { points, viewBox } = useMemo(
    () => getPolygonShape(coordinates),
    [coordinates],
  );

  return (
    <AreaContainer>
      <Svg viewBox={viewBox}>
        <Polygon points={points} />
      </Svg>
    </AreaContainer>
  );
};

export default Model3D;
