import { useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import styled from "styled-components";
import { useScrollDirectionContext } from "../../reducers/ScrollDirectionContext";

const TAB_BAR_HEIGHT = 40;
const mobileLandscape = "@media (max-height: 500px) and (max-width: 1000px)";

const TabsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};

  @media (min-width: 998px) {
    padding-bottom: 70px;
  }

  ${mobileLandscape} {
    height: 100dvh;
    padding-bottom: 0;
    overflow: hidden;
  }
`;

const Tab = styled.h3`
  white-space: nowrap;
  color: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.newColors.shades[30]};
  font-weight: 500;
  margin: 0;
  font-size: 15px;
  padding: 8px 26px;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.newColors.otherColors.inputBorder};
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 998px) {
    font-size: 18px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    border-bottom-color: ${(props) => props.theme.colors.primary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  overflow-x: auto;
  min-height: 50px;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  scrollbar-width: none;
  &::-webkit-scrollbar {
    height: 0;
  }

  ${mobileLandscape} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    min-height: ${TAB_BAR_HEIGHT}px;
    max-height: ${TAB_BAR_HEIGHT}px;
    transform: translateY(${(props) => (props.$hidden ? "-100%" : "0")});
    transition: transform 0.3s ease;
    will-change: transform;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  & > * {
    min-height: 0;
  }

  ${mobileLandscape} {
    flex: none;
    height: 100%;
    transform: translateY(
      ${(props) => (props.$hidden ? "0px" : `${TAB_BAR_HEIGHT}px`)}
    );
    transition: transform 0.3s ease;
    will-change: transform;
  }
`;

function Tabs({ items = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tabRefs = useRef([]);
  const tabContainerRef = useRef(null);
  const { isScrollingDown, updateScrollDirection } =
    useScrollDirectionContext();

  const segments = location.pathname.split("/").filter(Boolean);
  const isFeatureRoute = segments[0] === "feature";
  const hasSubTab = segments.length > 2;

  const basePath = isFeatureRoute
    ? `/${segments[0]}/${segments[1]}`
    : hasSubTab
      ? `/${segments[0]}`
      : location.pathname.split("/").slice(0, -1).join("/");

  const mainTabPaths = items.map((i) => i.path);
  let activeTabPath = segments[segments.length - 1];
  if (!mainTabPaths.includes(activeTabPath)) {
    activeTabPath = segments[segments.length - 2];
  }

  const activeIndex = items.findIndex((i) => i.path === activeTabPath);
  const activeTab = activeIndex === -1 ? 0 : activeIndex;

  useEffect(() => {
    updateScrollDirection(false);
  }, [location.pathname]);

  useEffect(() => {
    const container = tabContainerRef.current;
    const tab = tabRefs.current[activeTab];
    if (!container || !tab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const left =
      tabRect.left -
      containerRect.left +
      container.scrollLeft -
      (container.clientWidth - tabRect.width) / 2;

    container.scrollTo({ left, behavior: "smooth" });
  }, [activeTab]);

  if (!items.length) return null;

  const isInfoFeatureUrl = /^\/feature\/\d+/.test(location.pathname);

  return (
    <TabsWrapper>
      <TabContainer ref={tabContainerRef} $hidden={isScrollingDown}>
        {items.map((item, index) => (
          <Tab
            key={item.path}
            ref={(el) => (tabRefs.current[index] = el)}
            $active={index === activeTab}
            onClick={() =>
              navigate(`${basePath}/${item.path}`, { replace: true })
            }
          >
            {item.title}
          </Tab>
        ))}
      </TabContainer>

      <Content $hidden={isScrollingDown}>
        {isInfoFeatureUrl ? items[activeTab]?.content : <Outlet />}
      </Content>
    </TabsWrapper>
  );
}

export default Tabs;