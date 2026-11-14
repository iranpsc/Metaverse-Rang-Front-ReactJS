import styled from "styled-components";
import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import Sidebar, {
  getTradeSidebarItems,
} from "../../../../../components/Sidebar";
import SellerPrice from "../buyer-tab/SellerPrice";
import SuggestPrice from "../buyer-tab/SuggestPrice";
import { FeatureContext } from "../../../Context/FeatureProvider";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  overflow: hidden;
`;

// این کامپوننت برای تب خریدار در صفحه ملک مناسبه و بر اساس وجود قیمت، منوی کناری و مسیرهای «قیمت» و «پیشنهاد قیمت» رو نمایش میده
const BuyerTab = () => {
  const [feature] = useContext(FeatureContext);
  const hasPrice = feature.is_for_sale === 1 ? true : false;

  return (
    <Wrapper>
      <Sidebar
        variant="compact"
        items={getTradeSidebarItems(false, hasPrice)}
      />

      <Routes>
        <Route
          index
          element={<Navigate to={hasPrice ? "price" : "suggest"} replace />}
        />
        {hasPrice && <Route path="price" element={<SellerPrice />} />}
        <Route path="suggest" element={<SuggestPrice />} />
      </Routes>
    </Wrapper>
  );
};

export default BuyerTab;
