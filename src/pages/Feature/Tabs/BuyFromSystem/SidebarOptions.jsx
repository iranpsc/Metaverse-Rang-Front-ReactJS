import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility";

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
import { NavLink } from "react-router";
const Wrapper = styled.div`
  max-width: 171px !important;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  color: #dedee9;
  margin-top: 20px;
`;

const SidebarOptions = () => {
  return (
    <Wrapper>
      <NavLink to="../buy/price" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation("524")}</Label>
        )}
      </NavLink>
    </Wrapper>
  );
};

export default SidebarOptions;
