import { useEffect, useState } from "react";

import { FaChevronCircleLeft } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  height: ${(props) => (props.size ? "100%" : "220px")};
  border-radius: 10px;
  position: relative;
  margin:5px;
  background-color: #000000;
  margin-top: ${(props) => (props.size ? "0" : "20px")};
  display: ${(props) => (props.show && props.isMobile ? "none" : "block")};
  video {
    /* object-fit: contain !important; */
  }
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  z-index: 888;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  div {
    background-color: white;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    position: absolute;
  }
  svg {
    height: 100%;
    width: 100%;
    position: relative;
    color: #3b3b3b;
  }
`;

const Video = ({ show, size, setSize, video }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1369);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1369);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Container isMobile={isMobile} $size={size} show={show}>
      {size && (
        <Icon>
          <div />
          <FaChevronCircleLeft onClick={() => setSize(false)} />
        </Icon>
      )}
      <video
        width={450}
        height={230}
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
