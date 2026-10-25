import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility";
import { Label } from "../../../../components/Sidebar";
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
