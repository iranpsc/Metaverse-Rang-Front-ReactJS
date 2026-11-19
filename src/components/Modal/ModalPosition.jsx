// جهت نمایش مدال های سود انباشه و چالش ها و مدال های مشابه
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Header from "../Header/Header.jsx";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext.jsx";
import { useMenuContext } from "../../services/reducers/MenuContext.jsx";

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const Container = styled.div`
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

  @media screen and (max-width: 1023px) {
    ${({ $fullOnMobile }) => $fullOnMobile && "width: 100%;"}
  }
`;

const ModalPosition = ({ children, title, action, fullOnMobile = false }) => {
  const { isGlobalFullScreenMap } = useScrollDirectionContext();
  const { setHiddenOnMobile } = useMenuContext();

  useEffect(() => {
    if (!fullOnMobile) return;
    setHiddenOnMobile(true);
    return () => setHiddenOnMobile(false);
  }, [fullOnMobile, setHiddenOnMobile]);

  return (
    <Container $show={isGlobalFullScreenMap} $fullOnMobile={fullOnMobile}>
      <Header title={title} action={action} />
      {children}
    </Container>
  );
};

export default ModalPosition;