//جهت نمایش مدال های کوچک مثل قفل امنیت حساب
import styled from "styled-components";
import Header from "../Header/Header";
import { Overlay } from "./styles";

const Dialog = styled.div`
  width: 550px;
  margin: 0 auto;
  padding: 15px 20px;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
`;

const ModalXs = ({ children, title, handleExitClick, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Dialog>
        <Header title={title} handleExit={handleExitClick} />
        {children}
      </Dialog>
    </Overlay>
  );
};

export default ModalXs;
