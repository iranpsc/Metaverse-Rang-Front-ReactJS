// مدال کوچک عمومی برای مدال‌هایی مثل قفل امنیت حساب؛ با compact نسخه‌ی باریک‌تر (مثل رسید تراکنش)، با hideTitle بدون هدر و عنوان، و با global نسبت به کل صفحه (نه کانتینر والد) نمایش داده می‌شود

import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import Header from "../Header/Header";
import { ExitIcon } from "../Icons/IconsHeader";
import { Overlay } from "./styles";

// استایل قبلی کانتینر مدال رسید
const compactStyles = css`
  width: min(415px, calc(100vw - 24px));
  max-height: calc(100vh - 24px);
  max-height: calc(100dvh - 24px);
  padding: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    margin: 5px 0;
  }

  @media (max-width: 1000px) {
    width: min(380px, calc(100vw - 24px));
    padding: 8px;
  }
`;

const globalStyles = css`
  position: fixed;
  inset: 0;
  z-index: 100001;
`;

const GlobalAwareOverlay = styled(Overlay)`
  ${({ $global }) => $global && globalStyles}
`;

const Dialog = styled.div`
  position: relative;
  width: 550px;
  margin: 0 auto;
  padding: 15px 20px;
  
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};

  ${({ $compact }) => $compact && compactStyles}
`;

const ModalXs = ({
  noIcon,
  children,
  title,
  handleExitClick,
  onClose,
  onlyExit = false,
  compact = false,
  hideTitle = false,
  global = false,
  onReportClick,
  onHelpClick,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const modal = (
    <GlobalAwareOverlay $global={global} onClick={handleOverlayClick}>
      <Dialog $compact={compact}>
        {hideTitle ? (
          <ExitIcon trans="trans" onClick={handleExitClick ?? onClose} />
        ) : (
          !noIcon && (
            <Header
              title={title}
              handleExit={handleExitClick}
              onlyExit={onlyExit}
              onClose={onClose}
              onReportClick={onReportClick}
              onHelpClick={onHelpClick}
            />
          )
        )}
        {children}
      </Dialog>
    </GlobalAwareOverlay>
  );

  return global ? createPortal(modal, document.body) : modal;
};

export default ModalXs;
