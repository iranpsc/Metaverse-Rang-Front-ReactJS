import { useEffect } from "react";
import styled from "styled-components";
import ModalXs from "../../../components/Modal/ModalXs";
import { getTranslation } from "../../../services/Utility";
import TitleBody from "../../../components/TitleBody";
// کد ترجمه‌ی عنوان و توضیحات برای هر دارایی
const ASSET_TRANSLATIONS = {
  yellow: { title: "11", description: "506" },
  red: { title: "12", description: "507" },
  blue: { title: "49", description: "508" },
  irr: { title: "906", description: "514" },
  psc: { title: "47", description: "515" },
};

const Image = styled.img`
  display: block;

  @media (max-width: 1023px) {
    width: 100px;
    height: 100px;
  }
`;

const InfoModal = ({ data, setOpenModal }) => {
  const codes = ASSET_TRANSLATIONS[data?.asset];

  const closeModal = () => setOpenModal(false);

  // بستن با Escape
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenModal(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOpenModal]);

  if (!data) return null;

  return (
    <ModalXs
      global
      onlyExit
      hideTitle
      handleExitClick={closeModal}
      onClose={closeModal}
    >
      <Image src={data.image} alt="" height={160} loading="lazy" />
      <TitleBody title={getTranslation(codes.title)} size="big" />

      {codes && <TitleBody title={getTranslation(codes.description)} />}
    </ModalXs>
  );
};

export default InfoModal;
