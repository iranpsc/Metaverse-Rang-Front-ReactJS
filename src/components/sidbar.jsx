import styled from "styled-components";
const TAB_BAR_HEIGHT = 40;
export const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  padding: 15px 0;
  font-size: 16px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: fit-content;

  /* اسکرول داخلی */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  @media (min-width: 998px) {
    font-size: 18px;
    margin-bottom: 60px;
  }

  @media (max-height: 500px) and (max-width: 1000px) {
    margin-top: 0;
    margin-bottom: 0;
    height: 100%;
    max-height: 100%;
    /* جبران نوار تب و منوی پایین */
    padding-bottom: ${60 + TAB_BAR_HEIGHT}px;
    box-sizing: border-box;
  }
`;
export const Label = styled.div`
  font-weight: 500;
  white-space: wrap;
  color: ${(props) =>
    props.menu
      ? props.theme.colors.primary
      : props.theme.colors.newColors.shades.title};
  padding: 3px 20px;

  @media (min-width: 998px) {
    padding: 8px 20px;
  }
  cursor: pointer;
  border-inline-start: 2px solid
    ${(props) => (props.menu ? props.theme.colors.primary : "transparent")};
  transition: all 0.2s linear;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    border-inline-start: 2px solid ${(props) => props.theme.colors.primary};
  }
`;
