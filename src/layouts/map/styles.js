import styled from "styled-components";

// Styled components
export const Container = styled.div`
  width: 100%;
  position: relative;
`;

export const ZoomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-direction: column;
  position: absolute;
  top: 10px;
  ${(props) => (props.isPersian ? "left" : "right")}: 10px;
  padding: 3px;
  border-radius: 7px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
`;

export const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  z-index: 1;
  border-radius: 10px;
  width: 28px;
  height: 28px;
`;

export const FullscreenControlContainer = styled.div`
  position: absolute;
  top: 85px;
  ${(props) => (props.isPersian ? "left" : "right")}: 10px;
  z-index: 1;
  border-radius: 10px;
  width: 33px;
  height: 33px;
  padding: 5px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
`;

export const CustomButton = styled.div`
  width: 100%;
  height: 100%;
  fill: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  cursor: pointer;
`;
