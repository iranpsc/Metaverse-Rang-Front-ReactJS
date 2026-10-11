import styled from "styled-components";
import vector from "../../../../assets/images/profile/Vector.png";

export const Info = styled.div`
  @media (min-width: 1366px) {
    ${({ isPersian, theme }) => `
  ${isPersian
      ? `border-left: 1px solid ${theme.colors.newColors.otherColors.themeBtn};`
      : `border-right: 1px solid ${theme.colors.newColors.otherColors.themeBtn};`
    }
  ${isPersian ? "padding-left: 15px;" : "padding-right: 15px;"}
`}
  }
`;
export const SuggestionsContainer = styled.div`

  background-color: ${(props) => props.theme.colors.newColors.otherColors.menuBg};
  padding: 10px;
  border-radius: 5px;
`;

export const Wrapper = styled.div`
  display: grid;
  align-items: start;
  gap: 20px;
  margin-top: 20px;
`;

export const Location = styled.div`
  display: flex;
  white-space: wrap;

  align-items: center;
  gap: 20px;
  p {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 16px;
    font-weight: 600;
  }
  h3 {
    cursor: pointer;
    color: #ffc700;
    font-size: 14px;
    font-weight: 500;
    margin-top: 4px;
  }
`;
export const Property = styled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  justify-content: space-between;
  @media (min-width: 1366px) {
    flex-direction: row;
    align-items: center;
  }
`;
export const Value = styled.div`
  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  h2 {
    color: #a0a0ab;
    font-size: 14px;
    font-weight: 600;
  }
  span {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 16px;
    font-weight: 500;
  }
`;
export const Suggestions = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px 0;
`;

export const AreaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
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
  fill: ${({ karbari }) =>
    karbari === "m" ? "#fae52b" :
    karbari === "t" ? "#FF0000" :
    karbari === "a" ? "#2f00ff" : "#ffffff"};
  stroke-width: 1;
`;
export const proposerContainer = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  padding: 20px;
  border-radius: 10px;
  display: grid;
  gap: 15px;
  @media (min-width: 1366px) {
    grid-template-columns: 1fr 243px;
  }
`;
export const BasePrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ percent, theme }) => percent > 0 ? theme.colors.newColors.otherColors.offerbg : theme.colors.newColors.otherColors.offerbg2};

  border-radius: 6px;
  padding: 12px;
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 14px;
    font-weight: 500;
  }
`;
export const Prices = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 16px;
    font-weight: 500;
  }
  h3 {
    color: ${({ percent }) => (percent > 0 ? "#18C08F" : "#FF0000")};
    font-size: 18px;
    font-weight: 600;
  }
  div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
`;
export const RejectButton = styled.button`
  background-color: #c30000;
  color: #d7fbf0;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  font-size: 16px;
  position: relative;
  padding: 10px 22px;
  cursor: pointer;
  font-family: inherit;
`;
export const Text = styled.div`
  margin-top: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid inputBorder;
  p {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 16px;
    font-weight: 400;
  }
  span {
    color: ${(props) => props.theme.colors.primary};
    font-size: 16px;
    display: inline;
    font-weight: 400;
    cursor: pointer;
  }
  @media (min-width: 1366px) {
    border: none;
    padding-bottom: 0;
  }
`;
