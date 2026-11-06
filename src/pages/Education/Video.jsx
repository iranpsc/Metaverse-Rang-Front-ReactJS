import { useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: ${({ $fullscreen }) => ($fullscreen ? "1" : "0 0 220px")};
  min-height: ${({ $fullscreen }) => ($fullscreen ? "0" : "220px")};
  height: ${({ $fullscreen }) => ($fullscreen ? "100%" : "220px")};
  border-radius: 10px;
  position: relative;
  margin: ${({ $fullscreen }) => ($fullscreen ? "0" : "5px")};
  background-color: #000000;
  margin-top: ${({ $fullscreen }) => ($fullscreen ? "0" : "20px")};
  @media (max-width: 599px) {
    flex: ${({ $fullscreen }) =>
      $fullscreen ? "1" : "0 0 clamp(110px, 38vw, 150px)"};
    min-height: ${({ $fullscreen }) =>
      $fullscreen ? "0" : "clamp(110px, 38vw, 150px)"};
    height: ${({ $fullscreen }) =>
      $fullscreen ? "100%" : "clamp(110px, 38vw, 150px)"};
  }

  video {
    /* object-fit: contain !important; */
  }
`;

const Video = ({ isFullscreen, video }) => {
  const videoRef = useRef(null);

  return (
    <Container $fullscreen={isFullscreen}>
      <video
        ref={videoRef}
        width={450}
        height={200}
        alt="education"
        style={{
          borderRadius: "10px",
          cursor: "pointer",
          objectFit: "cover",
          height: "100%",
          width: "100%",
        }}
        controls
      >
        <source type="video/mp4" src={video} />
      </video>
    </Container>
  );
};

export default Video;
