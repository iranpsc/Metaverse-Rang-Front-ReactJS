// جهت نمایش مدال های سود انباشه و چالش ها و مدال های مشابه
import Header from "../Header/Header.jsx";

import { useScrollDirectionContext } from "../../hooks/useScrollDirectionContext.js";
// Styles.js
import styled, { keyframes } from "styled-components";

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Container = styled.div`
  position: relative;
  top: 0;
  bottom: 0;
  z-index: 10;
  display: ${({ $show }) => ($show ? "none" : "block")};
  width: 490px;
  height: 100%;
  padding: 15px 0;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
  animation: ${scaleIn} 0.2s ease-out;

  @media screen and (min-width: 1280px) {
    min-width: 490px;
  }
`;

const ModalPosition = ({ children, title, action }) => {
  const { isGlobalFullScreenMap } = useScrollDirectionContext();

  return (
    <Container $show={isGlobalFullScreenMap}>
      <Header title={title} action={action} />
      {children}
    </Container>
  );
};

export default ModalPosition;
