// اسلایدر ویدیو و تصاویر تب ورود (اسلایدر اصلی بالا و ردیف بندانگشتی پایین که با کلیک روی هر بندانگشتی، اسلاید اصلی را عوض می‌کند)؛ مناسب EnterInfo

import "keen-slider/keen-slider.min.css";
import "../../../../styles/styles.css";
import styled, { css } from "styled-components";
import { useKeenSlider } from "keen-slider/react";

const MAIN_SIZE = { width: 450, height: 200 };
const THUMB_SIZE = { width: 144, height: 100 };

const MAIN_OPTIONS = { initial: 0 };
const THUMB_OPTIONS = {
  initial: 0,
  slides: { perView: 3, spacing: 10 },
  breakpoints: {
    "(max-width: 1500px)": { slides: { perView: 5, spacing: 10 } },
  },
};

// فعلاً فقط آیتم اول ویدیو و بقیه تصویر است (داده‌ی نمونه)
const isVideo = ({ id }) => id === 1;

// بندانگشتی فعال کلاس active می‌گیرد و با کلیک روی هر بندانگشتی، اسلاید اصلی به همان آیتم می‌رود
const ThumbnailPlugin = (mainRef) => (slider) => {
  const setActive = (activeIndex) =>
    slider.slides.forEach((slide, index) =>
      slide.classList.toggle("active", index === activeIndex),
    );

  slider.on("created", () => {
    const main = mainRef.current;
    if (!main) return;

    setActive(slider.track.details.rel);
    slider.slides.forEach((slide, index) =>
      slide.addEventListener("click", () => main.moveToIdx(index)),
    );

    main.on("animationStarted", (instance) => {
      const next = instance.animator.targetIdx || 0;

      setActive(instance.track.absToRel(next));
      slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
    });
  });
};

const Container = styled.div`
  height: 900px;
  overflow: hidden;
  border-radius: 10px;

  @media (min-width: 1500px) {
    height: 77%;
  }
`;

const MainSlider = styled.div`
  height: 8%;
  margin-bottom: 10px;
`;

const mediaStyles = css`
  border-radius: 10px;
  cursor: pointer;
`;

const Image = styled.img`
  ${mediaStyles}
  padding-bottom: ${({ $thumbnail }) => ($thumbnail ? "20px" : 0)};
`;

const Video = styled.video`
  ${mediaStyles}
  object-fit: cover;
  height: 500px;
  ${({ $thumbnail }) =>
    $thumbnail &&
    css`
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    `}
`;

const Slide = ({ item, size, thumbnail = false }) =>
  isVideo(item) ? (
    <Video
      {...size}
      className="keen-slider__slide"
      $thumbnail={thumbnail}
      controls={!thumbnail}
    >
      <source src={item.video} type="video/mp4" />
    </Video>
  ) : (
    <Image
      {...size}
      className="keen-slider__slide"
      $thumbnail={thumbnail}
      src={item.video}
      alt=""
      loading="lazy"
    />
  );

const VideoSlider = ({ data }) => {
  const videos = data[0].videos;

  const [sliderRef, instanceRef] = useKeenSlider(MAIN_OPTIONS);
  const [thumbnailRef] = useKeenSlider(THUMB_OPTIONS, [
    ThumbnailPlugin(instanceRef),
  ]);

  return (
    <Container>
      <MainSlider ref={sliderRef} className="keen-slider top">
        {videos.map((item) => (
          <Slide key={item.id} item={item} size={MAIN_SIZE} />
        ))}
      </MainSlider>

      <div ref={thumbnailRef} className="keen-slider video-thumbnail">
        {videos.map((item) => (
          <Slide key={item.id} item={item} size={THUMB_SIZE} thumbnail />
        ))}
      </div>
    </Container>
  );
};

export default VideoSlider;
