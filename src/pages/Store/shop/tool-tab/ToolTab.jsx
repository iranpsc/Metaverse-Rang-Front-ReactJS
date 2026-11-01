import { Outlet } from "react-router";
import styled from "styled-components";
import Sidebar from "../../../../components/Sidebar";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import { tools } from "../data";

const TOOL_BASE_PATH = "/store/tools";
const DEFAULT_TOOL_SEGMENT = "600";

const SIDEBAR_ITEMS = tools.map((item, index) => ({
  to: `${TOOL_BASE_PATH}/${item.path}`,
  end: false,
  // آیتم اول برای مسیر پیش‌فرض tools/600 هم فعال است
  activeSegments: index === 0 ? [DEFAULT_TOOL_SEGMENT] : undefined,
  renderTitle: () =>
    `${getTranslation("504")}${convertToPersian(item.number)}${getTranslation("505")}`,
}));

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  overflow: hidden;
`;

const ToolTab = () => (
  <Wrapper>
    <Sidebar items={SIDEBAR_ITEMS} />
    <Outlet />
  </Wrapper>
);

export default ToolTab;