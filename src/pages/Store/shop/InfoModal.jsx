import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { getTranslation } from "../../../services/Utility";
import { ExitIcon } from "../../../components/Icons/IconsHeader";

const BackGround = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.713);
  
`;

const Modal = styled.div`
  width: 100%;
  max-width: 680px;
  max-height: 577px;
    padding: 16px;

  border-radius: 10px;
  overflow-y: auto;
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};

  @media (max-width: 850px) {
    max-width: 590px;
  }

  @media (max-width: 1023px) {
    height: 90%;
        padding: 10px;

  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;

  @media (max-width: 1023px) {
    & img {
      width: 100px;
      height: 100px;
    }
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: flex-start;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.newColors.shades.title};

  @media (max-width: 1023px) {
    font-size: 18px;
  }
`;

const Info = styled.p`
  margin: 20px 0;
  font-size: 16px;
  font-weight: 400;
  text-align: justify;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

// کد ترجمه‌ی عنوان و توضیحات برای هر دارایی
const ASSET_TRANSLATIONS = {
  yellow: { title: "11", description: "506" },
  red: { title: "12", description: "507" },
  blue: { title: "49", description: "508" },
  irr: { title: "906", description: "514" },
  psc: { title: "47", description: "515" },
};

const InfoModal = ({ data, setOpenModal }) => {
  const codes = ASSET_TRANSLATIONS[data?.asset];

  const closeModal = useCallback(() => setOpenModal(false), [setOpenModal]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeModal]);

  if (!data) return null;

  return createPortal(
    <BackGround onClick={closeModal}>
      <Modal
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <img
            src={data.image}
            alt={codes ? getTranslation(codes.title) : ""}
            width={160}
            height={160}
            loading="lazy"
          />
          <CloseButton type="button" onClick={closeModal} aria-label="close">
            <ExitIcon />
          </CloseButton>
        </Header>
        {codes && (
          <div>
            <Title>{getTranslation(codes.title)}</Title>
            <Info>{getTranslation(codes.description)}</Info>
          </div>
        )}
      </Modal>
    </BackGround>,
    document.body
  );
};

export default InfoModal;