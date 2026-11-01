import styled from "styled-components";
import { Outlet } from "react-router";
import Sidebar from "../../../../components/Sidebar";

const Container = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
  overflow-y: hidden;

  @media (min-width: 1366px) {
    gap: 20px;
  }

  @media (min-width: 998px) {
    grid-template-columns: 160px 1fr;
  }
`;

const SIDEBAR_ITEMS = [
  { to: "received", title: "1335" },
  { to: "sent", title: "1336" },
];

const VodListTab = () => (
  <Container>
    <Sidebar items={SIDEBAR_ITEMS} />
    <Outlet />
  </Container>
);

export default VodListTab;
