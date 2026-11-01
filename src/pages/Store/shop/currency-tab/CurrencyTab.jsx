import { Outlet } from "react-router";
import styled from "styled-components";
import Sidebar from "../../../../components/Sidebar";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import { currencies } from "../data";

const CURRENCY_BASE_PATH = "/store/currency";
const DEFAULT_CURRENCY_SEGMENT = "currency";

const SIDEBAR_ITEMS = currencies.map((item, index) => ({
  to: `${CURRENCY_BASE_PATH}/${item.path}`,
  // آیتم اول برای مسیر پیش‌فرض /store/currency هم فعال است
  activeSegments: index === 0 ? [DEFAULT_CURRENCY_SEGMENT] : undefined,
  renderTitle: () => `${getTranslation("504")} ${convertToPersian(item.id)}`,
}));

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  height: 100vh;
  overflow-y: hidden;
`;

const CurrencyTab = () => (
  <Wrapper>
    <Sidebar items={SIDEBAR_ITEMS} />
    <Outlet />
  </Wrapper>
);

export default CurrencyTab;
