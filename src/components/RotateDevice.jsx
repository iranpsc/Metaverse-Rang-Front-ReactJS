import styled, { keyframes } from "styled-components";
import { getTranslation } from "../services/Utility";
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-90deg);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};

  @media screen and (max-width: 768px) and (orientation: portrait) {
    display: flex;
  }
`;

const Icon = styled.span`
  font-size: 64px;
  line-height: 1;
  animation: ${rotate} 1.5s ease infinite;
`;

const Message = styled.p`
  font-size: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const RotateDevice = () => (
  <Overlay>
    <Icon aria-hidden="true">📱</Icon>
    <Message>{getTranslation(1372)}</Message>
  </Overlay>
);

export default RotateDevice;
