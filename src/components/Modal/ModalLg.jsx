// این مدال مخصوص نمایش اطلاعات است و نمونه های استفاده در نمایش گزارش یا سند ارسال شده وقتی روی دکمه چشم کلیک میکنیم
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useIsRtl } from "../../services/reducers/LanguageContext.jsx";
import Header from "../Header/Header";
import { Overlay } from "./styles";

const Dialog = styled.div`
  position: absolute;
  ${({ $isPersian }) => ($isPersian ? "right: 0;" : "left: 0;")}
  z-index: 9999;
  width: 81%;
  height: 100%;
  padding: 20px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};

  @media (max-width: 685px) {
    width: 100%;
  }

  @media (min-width: 1023px) {
    position: static;
    height: 95%;
    max-width: 1335px;
    max-height: 790px;
    border-radius: 10px;
  }

  @media (min-width: 1024px) and (max-width: 1180px) {
    width: 86%;
  }

  @media (min-width: 1920px) {
    max-width: 71%;
    max-height: 821px;
  }
`;

const ModalLg = ({ children, titleId, setShowModal }) => {
  const isPersian = useIsRtl();

  return createPortal(
    <Overlay $isLarge>
      <Dialog $isPersian={isPersian}>
        <Header title={titleId} onlyExit onClose={() => setShowModal(false)} />
        {children}
      </Dialog>
    </Overlay>,
    document.body,
  );
};

export default ModalLg;
