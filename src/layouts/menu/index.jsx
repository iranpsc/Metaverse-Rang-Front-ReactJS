// Main side menu: the sidebar of the app layout, with a header, profile and login/action buttons. Width follows its content.
import styled from "styled-components";
import Header from "./Header";
import Profile from "./Profile";
import { useMenuContext } from "../../services/reducers/MenuContext.jsx";
import PrivateComponent from "../../middleware/PrivateComponent";
import PublicComponent from "../../middleware/PublicComponent";
import BtnsAfterLogin from "./BtnsAfterLogin";
import BtnLogin from "./BtnAction/BtnLogin";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext.jsx";
import { useIsRtl } from "../../services/reducers/LanguageContext.jsx";

const PADDING = "10px";
const PADDING_DESKTOP = "20px";

const BlurOverlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(58, 57, 57, 0.18);
  z-index: 999;
  display: ${({ $show }) => ($show ? "block" : "none")};

  @media (min-width: 833px) {
    display: none;
  }
`;

const Container = styled.div`
  position: relative;
  display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
  flex-direction: column;
  align-items: start;
  justify-content: start;
  flex: 0 0 auto;
  width: fit-content;
  height: 100%;
  box-sizing: border-box;
  padding: ${PADDING};
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.menuBg};
  transition: all 0.3s ease 0s;

  @media (max-width: 832px) {
    max-width: 260px;
    position: ${({ $isModalOpen }) => ($isModalOpen ? "absolute" : "relative")};
    z-index: 1000;
    height: ${({ $isModalOpen, $isOpen }) =>
      !$isModalOpen || $isOpen ? "100%" : "98.5%"};
    ${({ $isPersian }) => ($isPersian ? "right: 0;" : "left: 0;")}
    ${({ $isModalOpen, $isOpen }) =>
      $isModalOpen && $isOpen && "top: 0; border-radius: 0;"}
  }

  @media (min-width: 1024px) {
    padding: ${PADDING_DESKTOP};
  }
`;

const Menu = () => {
  const { isOpen } = useMenuContext();
  const { isModalOpen, isGlobalFullScreenMap } = useScrollDirectionContext();
  const isPersian = useIsRtl();

  return (
    <>
      <BlurOverlay $show={isModalOpen && isOpen} />

      <Container
        $isOpen={isOpen}
        $isModalOpen={isModalOpen}
        $isPersian={isPersian}
        $hidden={isGlobalFullScreenMap}
      >
        <Header />
        <PrivateComponent>
          <Profile />
        </PrivateComponent>

        <PublicComponent>
          <BtnsAfterLogin />
        </PublicComponent>
        <PublicComponent>
          <BtnLogin />
        </PublicComponent>
      </Container>
    </>
  );
};

export default Menu;