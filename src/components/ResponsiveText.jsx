import styled from "styled-components";
import { getSize } from "../styles/sizes";

const ResponsiveText = styled.span`
  font-size: ${({ $size = "default" }) =>
    `calc(${getSize($size, "base")} + 3px)`};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size = "default" }) =>
      `calc(${getSize($size, "tablet")} + 3px)`};
  }

  @media (min-width: 1024px) {
    font-size: ${({ $size = "default" }) =>
      `calc(${getSize($size, "desktop")} + 3px)`};
  }
`;

export default ResponsiveText;
