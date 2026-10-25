import { NavLink, useLocation } from "react-router";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import { Container, Label } from "../../../../components/Sidebar";
import { tools } from "../data";

const SideBar = () => {
  const location = useLocation();

  return (
    <Container>
      {tools.map((item, index) => (
        <NavLink
          key={item.id}
          to={`/store/tools/${item.path}`}
          replace
          className={({ isActive }) => {
            const customActive =
              location.pathname.endsWith("tools/600") && index === 0;

            return isActive || customActive ? "active-link" : "";
          }}
        >
          {({ isActive }) => {
            const customActive =
              location.pathname.endsWith("tools/600") && index === 0;

            return (
              <Label menu={isActive || customActive}>
                {getTranslation("504")}
                {convertToPersian(item.number)}
                {getTranslation("505")}
              </Label>
            );
          }}
        </NavLink>
      ))}
    </Container>
  );
};

export default SideBar;
