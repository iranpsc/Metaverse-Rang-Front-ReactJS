// جهت نمایش مدال های کوچک مثل نوتیفیکیشن  
import styled from "styled-components";
import Header from "../Header/Header";
import { useIsRtl } from "../../hooks/useLanguageContext.js";
import { Overlay } from "./styles";
import { scale } from "../../styles/sizes";

const Dialog = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(500px, calc(100vw - 24px));
  height: min(550px, 80vh);
  min-height: 240px;
  margin: 0 auto;
  ${scale("padding", {
    base: "10px 12px",
    tablet: "12px 16px",
    laptop: "15px 20px",
  })}
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};

  & > div:first-child {
    min-width: 0;
  }

  @media (min-width: 1000px) {
    height: 550px;
    ${({ $isPersian }) =>
      $isPersian ? "margin-right: 100px;" : "margin-left: 100px;"}
  }
`;


const ModalSm = ({ children, title }) => {
  const isPersian = useIsRtl();

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