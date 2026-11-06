import styled from "styled-components";
import { SanitizeHTML } from "../services/Utility";
import { getSize } from "../styles/sizes";

const Content = styled.div`
  width: 100%;
  overflow-wrap: anywhere;
  font-size: ${({ $size }) => getSize($size, "base")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

const HtmlContent = ({ html, className, style, size = "default" }) => (
  <Content
    className={className}
    style={style}
    $size={size}
    dangerouslySetInnerHTML={{
      __html: SanitizeHTML(html),
    }}
  />
);

export default HtmlContent;
