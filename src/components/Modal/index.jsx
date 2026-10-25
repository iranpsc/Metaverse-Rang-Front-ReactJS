//این مدال برای کامپوننت های عمومی مانند پروفایل و تنظیمات استفاده شده
import styled from "styled-components";
import Header from "../Header/Header";
import { useLanguage } from "../../hooks/useLanguageContext.js";
import { Overlay } from "./styles";

const Dialog = styled.div`
  position: absolute;
  ${({ $isPersian }) => ($isPersian ? "right: 0;" : "left: 0;")}
  z-index: 12;
  width: 81%;
  max-width: 800px;
  height: 100%;
  padding: 15px 14px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};

  @media (min-width: 1023px) {
    position: static;
    height: 94%;
    max-width: 1330px;
    max-height: 782px;
    border-radius: 10px;
  }

  @media (min-width: 1024px) and (max-width: 1180px) {
    width: 85%;
  }

  @media (min-width: 1400px) {
    overflow: hidden;
  }

  @media (min-width: 1920px) {
    max-width: 70%;
    max-height: 820px;
  }
`;

const Modal = ({ children, title }) => {
  const isPersian = useLanguage();

  return (
    <Overlay>
      <Dialog $isPersian={isPersian}>
        <Header title={title} />
        {children}
      </Dialog>
    </Overlay>
  );
};

export default Modal;
