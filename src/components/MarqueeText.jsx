// Text that auto-scrolls (marquee) when it is wider than maxWidth; suitable for any short single-line label/value inside a limited-width box. Scroll direction follows the page direction (RTL/LTR), and the loop is seamless.
import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import useLanguage from "../hooks/useLanguage";

const GAP = 20;
const SPEED = 20; // px per second

const scrollLtr = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const scrollRtl = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(50%); }
`;

const Box = styled.div`
  min-width: 0;
  max-width: ${({ $maxWidth }) =>
    typeof $maxWidth === "number" ? `${$maxWidth}px` : $maxWidth || "100%"};
  overflow-x: ${({ $animate }) => ($animate ? "hidden" : "auto")};
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  ${({ $animate, $rtl, $duration }) =>
    $animate &&
    css`
      animation: ${$rtl ? scrollRtl : scrollLtr} ${$duration}s linear infinite;
    `}
`;

const Item = styled.span`
  display: flex;
  flex-shrink: 0;
  padding-inline-end: ${({ $gap }) => $gap}px;
`;

const MarqueeText = ({ children, maxWidth, disabled = false }) => {
  const { isRtl } = useLanguage();
  const boxRef = useRef(null);
  const itemRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    const item = itemRef.current;
    if (!box || !item || disabled) {
      setAnimate(false);
      return;
    }
    // عرض یک کپی (بدون گپ) رو با عرض جعبه مقایسه می‌کنیم
    const textWidth = item.scrollWidth - GAP;
    const overflow = textWidth > box.clientWidth;
    setAnimate(overflow);
    setDuration((textWidth + GAP) / SPEED);
  }, [children, maxWidth, disabled]);

  return (
    <Box ref={boxRef} $maxWidth={maxWidth} $animate={animate}>
      <Track $animate={animate} $rtl={isRtl} $duration={duration}>
        <Item ref={itemRef} $gap={GAP}>
          {children}
        </Item>
        {animate && (
          <Item $gap={GAP} aria-hidden="true">
            {children}
          </Item>
        )}
      </Track>
    </Box>
  );
};

export default MarqueeText;