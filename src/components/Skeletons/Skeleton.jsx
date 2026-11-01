// Skeleton.js
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

export const Skeleton = styled.div`
  padding:${(props) => props.padding || "0px"};
  border-radius: ${(props) => props.radius || "10px"};
  margin-top:${(props) => props.marginTop || ""};
  margin-bottom:${(props) => props.marginBot || ""};
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.colors.newColors.shades.bg02},
    ${(props) => props.theme.colors.newColors.shades.bg002},
    ${(props) => props.theme.colors.newColors.shades.bg0002}
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;

  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
`;