// Mobile/tablet layout of the gallery (hidden from 1024px up): main image next to a thumbnail strip. Used inside Slider.
import styled from "styled-components";

import MainSlider from "./MainSlider";
import ThumbSlider from "./ThumbSlider";

const Wrapper = styled.div`
  position: absolute;
  inset: 5%;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(64px, 2fr);
  gap: 14px;
  overflow: hidden;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileSlider = ({
  images = [],
  deleteHandler,
  activeImage,
  setActiveImage,
  isOwner,
}) => (
  <Wrapper>
    <MainSlider
      activeImage={activeImage}
      deleteHandler={deleteHandler}
      isOwner={isOwner}
    />
    <ThumbSlider
      images={images}
      activeImage={activeImage}
      setActiveImage={setActiveImage}
    />
  </Wrapper>
);

export default MobileSlider;