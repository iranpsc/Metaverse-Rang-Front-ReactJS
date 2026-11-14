// Full-screen overlay for the building lottie pages (Commercial, Educational, Residential, Signup): plays the background animation, shows the page SVG (children) with a translated title/description, then redirects home after 5s.
import Lottie from "lottie-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import SvgAni from "../../../assets/Json/AniBackSvg.json";
import { getTranslation } from "../../../services/Utility";

const Container = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  z-index: 100000000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #7777779e;

  & > svg {
    z-index: 1199;
  }
`;

const TextContainer = styled.div`
  z-index: 1200;
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-right: 30px;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Title = styled.span`
  font-size: 2rem;
`;

const Description = styled.span`
  font-size: 1.2rem;
`;

export default function LottieLayout({ children, title, description }) {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const timeout = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Container>
      <Lottie animationData={SvgAni} style={{ position: "absolute" }} />
      {children}
      <TextContainer>
        <Title>{getTranslation(title)}</Title>
        {description && <Description>{getTranslation(description)}</Description>}
      </TextContainer>
    </Container>
  );
}