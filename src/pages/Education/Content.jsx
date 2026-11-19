// بخش متن و توضیحات کارت آموزش (عنوان و توضیحات HTML)؛ در حالت عادی ارتفاعش به اندازهٔ محتوا است و با سقف اسکرول می‌گیرد، در حالت تمام‌صفحه کل فضای باقی‌مانده را می‌گیرد

import styled, { css } from "styled-components";
import TitleHeader from "../../components/TitleHeader";
import { getSize } from "../../styles/sizes";
import HtmlContent from "../../components/HtmlContent";

const Container = styled.div`
  padding: 0 5px;
  overflow-y: auto;

  ${({ $fullscreen }) =>
    $fullscreen
      ? css`
          flex: 1;
          min-height: 0;
        `
      : css`
          max-height: 210px;

          @media (max-width: 1000px) {
            flex-shrink: 0;
            max-height: 70px;
          }
        `}

  @media (min-width: 1401px) {
    padding-right: 15px;
  }

  @media (max-width: 1000px) {
    padding: 0 8px;
  }

  p {
    color: #969696;
    font-size: ${getSize("default", "base")};
    font-weight: 500;
    line-height: 1.6;
    text-align: justify;

    @media (min-width: 500px) and (max-width: 999px) {
      font-size: ${getSize("default", "tablet")};
    }

    @media (min-width: 1280px) {
      font-size: ${getSize("default", "desktop")};
    }
  }
`;

const Content = ({ data, isFullscreen }) => (
  <Container $fullscreen={isFullscreen}>
    {data?.title && <TitleHeader noMargin title={data?.title} />}
    <HtmlContent html={data?.description} />
  </Container>
);

export default Content;