import { getTranslation } from "../../../../services/Utility";
import { Container, Label } from "../../../../components/Sidebar";
import { NavLink } from "react-router";

const Sidebar = () => {
  return (
    <Container>
      <NavLink to="houses" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation("58")}</Label>
        )}
      </NavLink>
      <NavLink to="following" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation("55")}</Label>
        )}
      </NavLink>
      <NavLink to="followers" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation("38")}</Label>
        )}
      </NavLink>{" "}
    </Container>
  );
};
  
export default Sidebar;
