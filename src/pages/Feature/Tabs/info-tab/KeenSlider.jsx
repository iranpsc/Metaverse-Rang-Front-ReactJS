// Desktop gallery inside Slider: main keen-slider + centered thumbnail strip between prev/next arrows, owner delete and report actions. Hidden below 1024px (MobileSlider is used there).
import "keen-slider/keen-slider.min.css";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useKeenSlider } from "keen-slider/react";
import PhotoActionButton from "./components/PhotoActionButton.jsx";
const Wrapper = styled.div`
  position: absolute;
  inset: 5%;
  z-index: 1;
  display: none;
  direction: ltr;

  @media (min-width: 1024px) {
    display: block;
  }

  > .keen-slider:first-child {
    width: 100%;
    height: 75%;
  }
`;
const ActionButton = styled(PhotoActionButton)`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 1;
`;
const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  color: #fff;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 100%;
  margin: 0 auto;

  img {
    position: relative;

    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }
`;

const ThumbnailWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 20%;
  margin-top: 2%;

  .keen-slider {
    flex: 1;
    min-width: 0;
    height: 100%;
    align-items: center;
  }
`;

const Thumb = styled.button`
  && {
    display: block;
    min-width: 0;
    min-height: 0;
    height: 100%;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
    transform: scale(${({ $active }) => ($active ? 1 : 0.88)});
    transition: transform 0.3s ease-in-out;

    ${({ $active }) =>
      $active &&
      css`
        outline: 2px solid ; 
        
        outline-color: ${({ theme }) => theme.colors.primary};
;
        outline-offset: -2px;
      `}
  }
`;

const ArrowButton = styled.button`
  display: flex;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 0;
  border-radius: 50%;
  background: #353535;
  fill: #fff;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  &:disabled {
    fill: #bdbbbb90;
    cursor: default;
  }
`;

const ARROW_PATHS = {
  left: "M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z",
  right: "M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z",
};

const Arrow = ({ label, direction, disabled, onClick }) => (
  <ArrowButton
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={ARROW_PATHS[direction]} />
    </svg>
  </ArrowButton>
);

export default function KeenSlider({
  images = [],
  deleteHandler,
  activeImage,
  isOwner,
}) {
  const activeIndex = images.findIndex((image) => image.id === activeImage?.id);
  const initialSlide = Math.max(0, activeIndex);

  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: initialSlide,
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  });

  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider({
    initial: initialSlide,
    slides: { origin: "center", perView: 2, spacing: 10 },
    breakpoints: {
      "(min-width: 460px)": {
        slides: { origin: "center", perView: 3, spacing: 10 },
      },
      "(min-width: 768px)": {
        slides: { origin: "center", perView: 4, spacing: 10 },
      },
      "(min-width: 998px)": {
        slides: { origin: "center", perView: 5, spacing: 15 },
      },
      "(min-width: 1200px)": {
        slides: { origin: "center", perView: 6, spacing: 15 },
      },
    },
  });

  useEffect(() => {
    if (
      activeIndex >= 0 &&
      instanceRef.current?.track.details.rel !== activeIndex
    ) {
      instanceRef.current?.moveToIdx(activeIndex);
    }
  }, [activeIndex, instanceRef]);

  useEffect(() => {
    thumbnailInstanceRef.current?.moveToIdx(currentSlide);
  }, [currentSlide, thumbnailInstanceRef]);

  const hasMany = images.length > 1;
  console.log("isOwner", isOwner);
  return (
    <Wrapper>
      <div ref={sliderRef} className="keen-slider">
        {images.map((image, index) => (
          <Slide key={image.id} className="keen-slider__slide">
            <ImageWrapper>
              <img src={image.url} alt={`Image ${index + 1}`} loading="lazy" />
              <ActionButton
                image={image}
                isOwner={isOwner}
                onDelete={deleteHandler}
              />
            </ImageWrapper>
          </Slide>
        ))}
      </div>

      <ThumbnailWrapper>
        {hasMany && (
          <Arrow
            label="Previous image"
            direction="left"
            disabled={currentSlide === 0}
            onClick={() => instanceRef.current?.prev()}
          />
        )}
        <div ref={thumbnailRef} className="keen-slider">
          {images.map((image, index) => (
            <Thumb
              key={image.id}
              type="button"
              className="keen-slider__slide"
              $active={currentSlide === index}
              aria-label={`Show image ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
              onClick={() => instanceRef.current?.moveToIdx(index)}
            >
              <img src={image.url} alt="" loading="lazy" />
            </Thumb>
          ))}
        </div>
        {hasMany && (
          <Arrow
            label="Next image"
            direction="right"
            disabled={currentSlide === images.length - 1}
            onClick={() => instanceRef.current?.next()}
          />
        )}
      </ThumbnailWrapper>
    </Wrapper>
  );
}
