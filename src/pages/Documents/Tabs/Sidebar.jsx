import { NavLink } from "react-router";
import { getTranslation } from "../../../services/Utility";
import { Container, Label } from "../../../components/Sidebar";

const Sidebar = () => {
  return (
    <Container>
      <NavLink to="received" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation("1335")}</Label>
        )}
      </NavLink>

      <NavLink to="sent" replace end>
        {({ isActive }) => (
          <Label menu={isActive}>{getTranslation("1336")}</Label>
        )}
      </NavLink>
    </Container>
  );
};

export default Sidebar;
