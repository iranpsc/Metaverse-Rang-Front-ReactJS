import styled from "styled-components";
import { Outlet } from "react-router";
import Sidebar from "../../../../components/Sidebar";

const Container = styled.div`
  height: 100%;
  display: flex;
  gap: 20px;
  overflow-y: hidden;
`;
const SIDEBAR_ITEMS = [
  { to: "recieved", title: "764" },
  { to: "sent", title: "765" },
];

const SuggestionTab = () => {
  return (
    <Container>
      <Sidebar items={SIDEBAR_ITEMS} />
      <Outlet />
    </Container>
  );
};

export default SuggestionTab;
