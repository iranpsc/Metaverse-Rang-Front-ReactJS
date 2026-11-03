// سایدبار منوی کناری عمومی برای همه بخش‌های پروژه؛ با پراپ items (مسیر + کلید ترجمه عنوان) لینک‌های همان بخش را نمایش می‌دهد، با activeSegments یک آیتم می‌تواند روی سگمنت‌های دیگر مسیر هم فعال شود و variant="compact" نسخه‌ی فشرده‌ی منوی خرید/فروش است

import styled, { css } from "styled-components";
import { NavLink, useLocation } from "react-router";
import { getTranslation } from "../services/Utility";

const TAB_BAR_HEIGHT = 60;

// نسخه فشرده (قبلاً Wrapper در SidebarOptions)
const compactVariant = css`
  max-width: 171px;
  min-width: auto;
  height: 500px;
  padding: 0;
  gap: 0;
  color: #dedee9;

  @media (min-width: 998px) {
    font-size: inherit;
    margin-bottom: 0;
  }
`;

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  padding: 15px 0;
  font-size: 16px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: fit-content;

  /* اسکرول داخلی */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  @media (min-width: 998px) {
    font-size: 18px;
    margin-bottom: 60px;
  }

  @media (max-height: 500px) and (max-width: 1000px) {
    margin-bottom: 0;
    height: 100%;
    max-height: 100%;
    /* جبران نوار تب و منوی پایین */
    padding-bottom: ${60 + TAB_BAR_HEIGHT}px;
    box-sizing: border-box;
  }

  ${({ $variant }) => $variant === "compact" && compactVariant}
`;

const Label = styled.div`
  font-weight: 500;
  white-space: normal;
  color: ${(props) =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.newColors.shades.title};
  padding: 3px 20px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  border-inline-start: 2px solid
    ${(props) => (props.$active ? props.theme.colors.primary : "transparent")};
  transition: all 0.2s linear;

  @media (min-width: 998px) {
    padding: 8px 20px;
  }

  ${({ $disabled }) =>
    $disabled
      ? css`
          opacity: 0.4;
        `
      : css`
          &:hover {
            color: ${(props) => props.theme.colors.primary};
            border-inline-start: 2px solid ${(props) => props.theme.colors.primary};
          }
        `}
`;
// آیتم‌های منوی خرید/فروش (قبلاً SidebarOptions) بر اساس seller و hasPrice
export const getTradeSidebarItems = (seller, hasPrice) => [
  {
    to: seller ? "../sell/lowest" : "../buy/price",
    title: seller ? "517" : "524",
    show: Boolean(seller || hasPrice),
  },
  {
    to: seller ? "../sell/PriceDefine" : "../buy/suggest",
    title: seller ? "519" : "525",
  },
];
const Sidebar = ({ items = [], variant = "default" }) => {
  const { pathname } = useLocation();
  const lastSegment = pathname.split("/").pop();

  return (
    <Container $variant={variant}>
      {items
        .filter(({ show = true }) => show)
        .map(
          ({
            to,
            title,
            renderTitle,
            end = true,
            replace = true,
            activeSegments,
            disabled = false,
          }) => (
            <NavLink
              key={to}
              to={to}
              replace={replace}
              end={end}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : undefined}
              onClick={(e) => disabled && e.preventDefault()}
            >
              {({ isActive }) => (
                <Label
                  $disabled={disabled}
                  $active={
                    !disabled &&
                    (isActive || Boolean(activeSegments?.includes(lastSegment)))
                  }
                >
                  {renderTitle ? renderTitle() : getTranslation(title)}
                </Label>
              )}
            </NavLink>
          ),
        )}
    </Container>
  );
};
export default Sidebar;