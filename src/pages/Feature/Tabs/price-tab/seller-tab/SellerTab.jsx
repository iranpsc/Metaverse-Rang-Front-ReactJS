// تب فروشنده در صفحه‌ی ملک (پایین‌ترین قیمت و تعیین قیمت) با سایدبار فشرده‌ی خرید و فروش در کنار مسیرهای داخلی؛ مناسب مسیر sell

import styled from "styled-components";
import { Navigate, Route, Routes } from "react-router";
import Lowest from "./Lowest";
import PriceDefine from "./PriceDefine";
import Sidebar, {
  getTradeSidebarItems,
} from "../../../../../components/Sidebar";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  overflow-y: hidden;
`;

const SellerTab = ({ seller }) => (
  <Wrapper>
    <Sidebar variant="compact" items={getTradeSidebarItems(seller)} />
    <Routes>
      <Route index element={<Navigate to="lowest" replace />} />
      <Route path="PriceDefine" element={<PriceDefine />} />
      <Route path="lowest" element={<Lowest />} />
    </Routes>
  </Wrapper>
);

export default SellerTab;