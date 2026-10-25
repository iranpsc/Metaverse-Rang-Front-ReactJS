// جهت نمایش مدال های کوچک مثل نوتیفیکیشن  
import styled from "styled-components";
import Header from "../Header/Header";
import { useLanguage } from "../../hooks/useLanguageContext.js";
import { Overlay } from "./styles";


const Dialog = styled.div`
  width: 500px;
  height: 260px;
  margin: 0 auto;
  padding: 15px 20px;
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};

  @media (min-width: 1000px) {
    height: 550px;
    ${({ $isPersian }) =>
      $isPersian ? "margin-right: 100px;" : "margin-left: 100px;"}
  }
`;


const ModalSm = ({ children, title }) => {
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

export default ModalSm;