// تب سلسله (Dynasty): چیدمان سایدبار + محتوای تب؛ صفحه‌ی ایجاد/املاک سلسله داده‌ی خودش را می‌گیرد

import styled from "styled-components";
import { Outlet, useParams } from "react-router";
import Sidebar from "../../../../components/Sidebar.jsx";
import DynastyEstablishEstate from "./DynastyEstablishEstate";
import { useDynastySidebarItems } from "./useDynastySidebarItems";

const Container = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  @media (min-width: 1366px) {
    gap: 20px;
  }
`;

const DynastyTab = () => {
  const { tab } = useParams();
  const items = useDynastySidebarItems();

  const isEstablishEstate = tab === "establish" || tab === "estate";

  return (
    <Container>
      <Sidebar items={items} />
      {isEstablishEstate ? <DynastyEstablishEstate tab={tab} /> : <Outlet />}
    </Container>
  );
};

export default DynastyTab;
