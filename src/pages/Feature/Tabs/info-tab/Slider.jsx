// Fullscreen image gallery modal (rendered in a portal): desktop thumbnail slider + mobile swipe slider, with optional delete for the owner. Closes via Esc, backdrop click or close button.
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";

import KeenSlider from "./KeenSlider";
import MobileSlider from "./MobileSlider";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: rgb(0 0 0 / 90%);
`;
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #3b3b3b;
  color: #fff;
  cursor: pointer;

  svg {
    font-size: 24px;
    transition: color 0.1s ease-in-out;
  }

  &:hover svg {
    color: #ff4d4f;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;

const Slider = ({
  setOpen,
  images = [],
  deleteHandler,
  activeImage,
  setActiveImage,
  isOwner,
}) => {
  const closeSlider = () => setOpen(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpen]);

  return createPortal(
    <Overlay
      onClick={(event) => {
        if (event.target === event.currentTarget) closeSlider();
      }}
    >
      <CloseButton type="button" onClick={closeSlider}>
        <IoMdClose />
      </CloseButton>
      <MobileSlider
        images={images}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        deleteHandler={deleteHandler}
        isOwner={isOwner}
      />
      <KeenSlider
        images={images}
        activeImage={activeImage}
        deleteHandler={deleteHandler}
        isOwner={isOwner}
      />
    </Overlay>,
    document.body,
  );
};

export default Slider;
