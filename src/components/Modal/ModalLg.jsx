import styled from "styled-components";
import Title from "../Title";
import { getTranslation } from "../../services/Utility";
import { ExitIcon, ReportIcon } from "../Icons/IconsHeader";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.315);
  z-index: 9999;
`;

const ModalContainer = styled.div`
  padding: 20px 0;
  width: 81%;
  overflow: hidden;
  height: 100%;
  position: absolute;
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  padding: 20px;
  z-index: 9999;
  right: 0;

  @media (max-width: 685px) {
    width: 100%;
  }
  @media (min-width: 1023px) {
    height: 95%;
    max-width: 1335px;
    max-height: 790px;
    position: static;
    right: auto;
    border-radius: 10px;
  }

  @media (min-width: 1024px) and (max-width: 1180px) {
    width: 86%;
  }

  @media (min-width: 1400px) {
    overflow: hidden;
  }

  @media (min-width: 1920px) {
    max-width: 71%;
    max-height: 821px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    gap: 10px;
  }
`;

const ModalLg = ({ children, titleId, setShowModal, report }) => {
  const Navigate = useNavigate();
  return (
    createPortal(
      <ModalBackdrop>
        <ModalContainer>
          <ModalHeader>
            <Title title={getTranslation(titleId)} />
            <div>
              {report && (
                <ReportIcon
                  onClick={() =>
                    Navigate("/report/send", {
                      state: {
                        from: location.pathname,
                      },
                    })
                  }
                />
              )}{" "}
              <ExitIcon onClick={() => setShowModal(false)} />
            </div>
          </ModalHeader>
          {children}
        </ModalContainer>
      </ModalBackdrop>,
      document.body
    )
  );
};

export default ModalLg;
