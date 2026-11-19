// پخش‌کنندهٔ ویدیوی آموزش با نسبت تصویر ثابت و سقف ارتفاع؛ در حالت تمام‌صفحه کل فضای والد را می‌گیرد

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  padding-top: 10px;
  height: 30vh;
  @media (max-width: 1024px) {
    height: 40vh;
  }
`;

const StyledVideo = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  object-fit: contain;
`;

const Video = ({ isFullscreen, video }) => (
  <Container $fullscreen={isFullscreen}>
    <StyledVideo controls>
      <source type="video/mp4" src={video} />
    </StyledVideo>
  </Container>
);

export default Video;
