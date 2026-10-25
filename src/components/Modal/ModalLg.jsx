// این مدال مخصوص نمایش اطلاعات است و نمونه های استفاده در نمایش گزارش یا سند ارسال شده وقتی روی دکمه چشم کلیک میکنیم
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { useLanguage } from "../../hooks/useLanguageContext";
import Title from "../Title";
import { ExitIcon, ReportIcon } from "../Icons/IconsHeader";
import { getTranslation } from "../../services/Utility";
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalLg = ({ children, titleId, setShowModal, report }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isPersian = useLanguage();
  const handleReport = () => {
    navigate("/report/send", { state: { from: pathname } });
  };
  return createPortal(
    <Overlay $isLarge>
      <Dialog $isPersian={isPersian}>
        <Header>
          <Title title={getTranslation(titleId)} />
          <Actions>
            {report && <ReportIcon onClick={handleReport} />}
            <ExitIcon onClick={() => setShowModal(false)} />
          </Actions>
        </Header>
        {children}
      </Dialog>
    </Overlay>,
    document.body,
  );
};

export default ModalLg;
