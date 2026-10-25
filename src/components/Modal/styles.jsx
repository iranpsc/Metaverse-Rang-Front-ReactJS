import styled from "styled-components";
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.713);
  backdrop-filter: blur(${({ $isLarge }) => ($isLarge ? "5px" : "0.8px")});
`;