import styled from "styled-components";
import Header from "./Header";
import Profile from "./Profile";
import { useMenuContext } from "../../services/reducers/MenuContext";
import PrivateComponent from "../../middleware/PrivateComponent";
import PublicComponent from "../../middleware/PublicComponent";
import BtnsAfterLogin from "./BtnsAfterLogin";
import BtnLogin from "./BtnAction/BtnLogin";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext";
import { useLanguage } from "../../services/reducers/LanguageContext";

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(58, 57, 57, 0.18);
  z-index: 999;
  display: ${({ show }) => (show ? "block" : "none")};

  @media (min-width: 833px) {
    display: none;
  }
`;
const Container = styled.div`
position: relative;
  display: ${({ show }) => (show ? "none" : "flex")};
  flex-direction: column;
  align-items: start;
  flex: 1;
  justify-content: start;
  width: ${({ isPersian, isOpen }) =>
    isPersian ? (isOpen ? "35%" : "9%") : isOpen ? "38%" : "9%"};

  height: 100%;
  border-radius: 10px;

  @media (max-width: 832px) {
    max-width: 260px;
    position: ${({ isModalOpen }) => (isModalOpen ? "absolute" : "relative")};
    z-index: 1000;
    height: ${({ isModalOpen, isOpen }) => {
      if (isModalOpen && isOpen) return "100%";
      if (!isModalOpen) return "100%";
      return "98.5%";
    }};
    ${({ isPersian }) => (isPersian ? "right:0" : "left: 0")};

    top: ${({ isModalOpen, isOpen }) => isModalOpen && isOpen && "0"};
    border-radius: ${({ isModalOpen, isOpen }) => isModalOpen && isOpen && "0"};
  }
  @media (min-width: 1024px) {
    width: ${(props) => (props.isOpen ? "32%" : "6.1%")};
    padding: 20px;
    padding-bottom: 10px;
  }
  @media (min-width: 1536px) {
    width: ${(props) => (props.isOpen ? "21.5%" : "4.1%")};
    border-radius: 10px;
    padding: 20px;
    padding-bottom: 10px;
  }
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  padding: ${(props) => (props.isOpen ? "5px" : "10px")};
  padding-bottom: 10px;

  transition: all 0.3s ease 0s;
`;

const Menu = () => {
  const { isOpen } = useMenuContext();
  const { isModalOpen, isGlobalFullScreenMap } = useScrollDirectionContext();
  const isPersian = useLanguage();
  return (
    <>
      <BlurOverlay show={isModalOpen && isOpen} />

      <Container
        isOpen={isOpen}
        isModalOpen={isModalOpen}
        isPersian={isPersian}
        show={isGlobalFullScreenMap}
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
