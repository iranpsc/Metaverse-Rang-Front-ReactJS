import vector from "../../../../../assets/images/profile/Vector.png";
import styled from "styled-components";
import { useMemo } from "react";
import { getPolygonShape } from "../../../../../services/Utility/getPolygonShape";
export const AreaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 100px;
  background-color: #2c2c2c;
  border-radius: 6px;
  position: relative;
  background-image: url(${vector});
  background-size: cover;
`;
export const StyledSVG = styled.svg`
  width: 100%;
  height: 100%;
`;
export const Polygon = styled.polygon`
    //color: ${({ percent }) => (percent > 0 ? "#18C08F" : "#FF0000")};
 fill: ${({ karbari }) =>
    karbari === "m" ? "#fae52b" :
      karbari === "t" ? "#FF0000" :
        karbari === "a" ? "#2f00ff" : "#ffff"
  };  stroke-width: 1;
    

`;
const Model3D = (data) => {
  const coordinates = data.data?.["dynasty-feature"]?.coordinates;
  const { points, viewBox } = useMemo(
    () => getPolygonShape(coordinates),
    [coordinates],
  );

  return (
    <AreaContainer>
      <StyledSVG viewBox={viewBox}>
        <Polygon
          karbari={"m"}
          points={points}
        />
      </StyledSVG>
    </AreaContainer>);
};

export default Model3D;
