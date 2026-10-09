// Print-only CSS: Only show Header, center it, hide print button and modal background
import { ExitIcon } from "../../../../components/Icons/IconsHeader";
const PrintOnlyStyles = () => (
  <style>{`
    @media print {
      body * {
        visibility: hidden !important;
      }
      #print-header, #print-header * {
        visibility: visible !important;
      }
      #print-header {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
       

        background: none !important;
        box-shadow: none !important;
        padding: 32px !important;
        margin: 0 !important;
        border-radius: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }
      .print-hide, .print-hide * {
        display: none !important;
      }
    }
  `}</style>
);
import { AiFillCloseCircle } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoReloadCircleSharp } from "react-icons/io5";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { getTranslation, ConvertJalali, convertToPersian } from "../../../../services/Utility";

const BackGround = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.713);
`;
const Modal = styled.div`
  position: relative;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  overflow-y: auto;
  padding: 10px;
  z-index: 999;
  width: min(415px, calc(100vw - 24px));
  height: auto;
  max-height: calc(100vh - 24px);
  max-height: calc(100dvh - 24px);

  &::-webkit-scrollbar-track {
    margin: 5px 0;
  }

  @media (max-width: 1000px) {
    padding: 8px;
      width: min(380px, calc(100vw - 24px));

  }
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    color: ${(props) =>
    props.status == "0"
      ? "#00966d"
      : props.status == "-138" || props.status == "-1"
        ? "#C30000"
        : "#FFC700"};
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    text-align: center;
  }

  @media (max-width: 1000px) {
    p {
      font-size: 18px;
    }
    span {
      font-size: 13px;
    }
  }
`;
const Div = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.status == "0"
      ? "#00966d"
      : props.status == "-138" || props.status == "-1"
        ? "#C30000"
        : "#FFC700"};
  margin-bottom: 10px;
  div {
    z-index: 0;
    position: absolute;
    border-radius: 100%;
    background-color: white;
    width: 50px;
    height: 50px;
  }
  svg {
    z-index: 1;
  }

  @media (max-width: 1000px) {
    margin-bottom: 4px;
    div {
      width: 34px;
      height: 34px;
    }
    svg {
      width: 56px;
      height: 56px;
    }
  }
`;
const Info = styled.div`
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  padding: 0 20px;
  width: 100%;
  border-radius: 10px;
  margin-top: 20px;


`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: ${(props) => props.not !== false && "1px solid #454545"};
  justify-content: space-between;

  @media (max-width: 480px) {
    padding: 5px 0;
    gap: 8px;
  }
`;

const Title = styled.h3`
  font-size: 16px;
  margin: 0;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-weight: 500;

  @media (max-width: 1000px) {
    font-size: 13px;
  }
`;

const Value = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  margin: 0;
  font-weight: 400;
  text-align: left;
  word-break: break-word;

  @media (max-width: 1000px) {
    font-size: 13px;
  }
`;
const Gif = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PrintModal = ({
  code,
  date,
  gif,
  time,
  status,
  title,
  count,
  setOpenPrint,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <BackGround>
      <Modal>
        <ExitIcon trans={"trans"} onClick={() => setOpenPrint(false)} />
        <PrintOnlyStyles />
        <Header id="print-header" status={status}>
          <Div status={status}>
            <div />
            {status == "0" ? (
              <BsCheckCircleFill size={80} />
            ) : status == "1" ? (
              <IoReloadCircleSharp size={80} />
            ) : (
              <AiFillCloseCircle size={80} />
            )}
          </Div>
          {status == "0" ? (
            <>
              <p>{getTranslation("744")}</p>
              <span>{getTranslation("745")}</span>
            </>
          ) : status == "-138" || status == "-1" ? (
            <>
              <p>{getTranslation("761")}</p>
              <span>{getTranslation("762")}</span>
            </>
          ) : (
            <>
              <p>{getTranslation("759")}</p>
              <span>{getTranslation("760")}</span>
            </>
          )}
          <Info>
            <Row>
              <Title>{getTranslation("750")}</Title>
              <Gif>
                <img
                  loading="lazy"
                  width={26}
                  height={26}
                  src={gif}
                  alt={code}
                />
                <Value>{getTranslation("353")} {convertToPersian(count)}</Value>
              </Gif>
            </Row>
            <Row>
              <Title>{getTranslation("747")}</Title>
              <Value>{code}</Value>
            </Row>
            <Row>
              <Title>{getTranslation("748")}</Title>
              <Value>{ConvertJalali(date)}</Value>
            </Row>
            <Row>
              <Title>{getTranslation("749")}</Title>
              <Value>{convertToPersian(time)}</Value>
            </Row>
            <Row>
              <Title>{getTranslation("750")}</Title>
              <Value>{title}</Value>
            </Row>
            <Row not={false}>
              <Title>{getTranslation("751")}</Title>
              <Value>{convertToPersian(count)}</Value>
            </Row>
            <div className="print-hide" style={{ margin: "8px 0" }}>
              <Button full label={getTranslation("67")} onclick={handlePrint} />
            </div>
          </Info>
        </Header>
      </Modal>
    </BackGround>,
    document.body
  );
};

export default PrintModal;
