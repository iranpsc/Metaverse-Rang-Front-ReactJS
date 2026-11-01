// Vertical thumbnail strip for the mobile gallery: the selected image is always centered between the up/down buttons, which select the previous/next image. Used inside MobileSlider.
import { useEffect, useRef } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  
`;

const ScrollArea = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* spacers let the first and last images reach the center too */
  &::before,
  &::after {
    content: "";
    flex: none;
    height: calc(39% - 12px);
  }
`;

const Thumb = styled.button`
  width: 100%;
  height: 22%;
  min-height: 60px;
  flex: none;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;

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
        outline: 2px solid;
        outline-color: ${({ theme }) => theme.colors.primary};

        outline-offset: -2px;
      `}
  }
`;

const ArrowButton = styled.button`
  display: flex;
  width: 40px;
  height: 40px;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: #3b3b3b;
  color: #fff;
  cursor: pointer;

  svg {
    font-size: 32px;
  }

  &:disabled {
    color: #bdbbbb90;
    cursor: default;
  }
`;

const ThumbSlider = ({ images = [], activeImage, setActiveImage }) => {
  const listRef = useRef(null);
  const activeIndex = images.findIndex((image) => image.id === activeImage?.id);

  useEffect(() => {
    const list = listRef.current;
    const thumb = list?.querySelectorAll("button")[activeIndex];
    if (!thumb) return;

    list.scrollTo({
      top: thumb.offsetTop - (list.clientHeight - thumb.offsetHeight) / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  const select = (index) => setActiveImage(images[index]);

  return (
    <Wrapper>
      <ArrowButton
        type="button"
        aria-label="Previous image"
        disabled={activeIndex <= 0}
        onClick={() => select(activeIndex - 1)}
      >
        <RiArrowUpSLine />
      </ArrowButton>

      <ScrollArea ref={listRef}>
        {images.map((image, index) => (
          <Thumb
            key={image.id}
            type="button"
            $active={index === activeIndex}
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => select(index)}
          >
            <img src={image.url} alt="" loading="lazy" />
          </Thumb>
        ))}
      </ScrollArea>

      <ArrowButton
        type="button"
        aria-label="Next image"
        disabled={activeIndex === images.length - 1}
        onClick={() => select(activeIndex + 1)}
      >
        <RiArrowDownSLine />
      </ArrowButton>
    </Wrapper>
  );
};

export default ThumbSlider;
