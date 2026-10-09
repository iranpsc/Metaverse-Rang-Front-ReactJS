import styled from "styled-components";
import { useRef, useEffect, forwardRef } from "react";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext";
const TAB_BAR_HEIGHT = 40;
const StyledContainer = styled.div`
  padding: 15px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  @media (max-height: 500px) and (max-width: 1000px) {
    /* ${TAB_BAR_HEIGHT}px جبران جابجایی محتوا به‌خاطر نوار تب */
    padding-bottom: ${60 + TAB_BAR_HEIGHT}px;
  }
`;

const DIRECTION_THRESHOLD = 12;
const TOP_OFFSET = 10;
const MIN_SCROLLABLE = 80; //80 defalut value 

function BaseContainer({ children, className }, forwardedRef) {
  const internalRef = useRef(null);
  const ref = forwardedRef || internalRef;
  const { updateScrollDirection } = useScrollDirectionContext();

  const updateRef = useRef(updateScrollDirection);
  updateRef.current = updateScrollDirection;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let lastY = element.scrollTop;
    let lastDirection = null;
    let ticking = false;

    const setDirection = (goingDown) => {
      if (lastDirection === goingDown) return;
      lastDirection = goingDown;
      updateRef.current(goingDown);
    };

    const update = () => {
      ticking = false;

      const y = element.scrollTop;
      const maxScroll = element.scrollHeight - element.clientHeight;

      if (y < 0 || y > maxScroll) return;

      if (maxScroll < MIN_SCROLLABLE || y < TOP_OFFSET) {
        setDirection(false);
        lastY = y;
        return;
      }

      const diff = y - lastY;

      if (Math.abs(diff) < DIRECTION_THRESHOLD) return;

      setDirection(diff > 0);
      lastY = y;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [ref]);

  return (
    <StyledContainer ref={ref} className={className}>
      {children}
    </StyledContainer>
  );
}

export default forwardRef(BaseContainer);