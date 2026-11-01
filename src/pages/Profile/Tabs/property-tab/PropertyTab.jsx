//import Sidebar from "./Sidebar";
import Sidebar from "../../../../components/Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router";
const Container = styled.div`
  display: flex;
  height: 100%;
  overflow-y: hidden;
`;
const SIDEBAR_ITEMS = [
  { to: "houses", title: "58" },
  { to: "following", title: "55" },
  { to: "followers", title: "38" },
];

const PropertyTab = () => {
  return (
    <Container>
      <Sidebar items={SIDEBAR_ITEMS} />
      <Outlet />
    </Container>
  );
};

export default PropertyTab;
