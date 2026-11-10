// styles/sizes.js
import { css } from "styled-components";
const BREAKPOINTS = { tablet: 500, laptop: 1000, desktop: 1280 };

export const SIZES = {
  default: { base: "14px", tablet: "12px", desktop: "16px" },
  small: { base: "12px", tablet: "10px", desktop: "13px" },
  big: { base: "16px", tablet: "14px", desktop: "18px" },
};

export const getSize = ($size, key) => (SIZES[$size] ?? SIZES.default)[key];
// فونت ریسپانسیو بر اساس $size
export const responsiveFontSize = css`
  font-size: ${({ $size = "default" }) => getSize($size, "base")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size = "default" }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size = "default" }) => getSize($size, "desktop")};
  }
`;
export const scale = (property, values) => css`
  ${property}: ${values.base};

  ${Object.entries(BREAKPOINTS).map(([key, min]) =>
    values[key]
      ? css`
          @media (min-width: ${min}px) {
            ${property}: ${values[key]};
          }
        `
      : null,
  )}
`;
