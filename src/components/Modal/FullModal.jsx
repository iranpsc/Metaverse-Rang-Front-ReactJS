// مدال شناور و قابل درگ (react-rnd) با اندازه‌ی ثابت یا ارتفاع auto طبق محتوا و حالت تمام‌صفحه؛ مناسب مدال‌های آموزش، راهنما و هر پنجره‌ی شناور مشابه

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import Header from "../Education/Header";

const SIZES = {
  sm: { width: 420, height: 300 },
  md: { width: 720, height: 480 },
  lg: { width: 1000, height: 640 },
  xl: { width: 1380, height: 750 },
};

const MOBILE_BREAKPOINT = 768;
const DRAG_HANDLE = "modal-drag-handle";

// المان‌های تعاملی داخل هدر (دکمه بستن، فول‌اسکرین و...) درگ رو شروع نکنن
const CANCEL_SELECTOR =
  "button, a, input, select, textarea, [role='button'], [data-no-drag]";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  background-color: rgba(0, 0, 0, 0.5);
`;

const StyledRnd = styled(Rnd)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-height: calc(100vh - 20px);
  background-color: ${(props) =>
    props.theme?.colors?.newColors?.shades?.background ||
    props.theme.colors.newColors.shades.bg2};
  border-radius: 10px;
  padding: 15px 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const FullscreenPanel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  background-color: ${(props) =>
    props.theme?.colors?.newColors?.shades?.background ||
    props.theme.colors.newColors.shades.bg2};
`;

const HeaderWrap = styled.div`
  flex-shrink: 0;
  ${({ $draggable }) =>
    $draggable &&
    `
    cursor: grab;
    &:active { cursor: grabbing; }
    button, a, [role="button"], [data-no-drag] { cursor: pointer; }
  `}
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
};

const FullModal = ({
  open = true,
  onClose,
  size = "xl",
  title,
  loading = false,
  draggable = true,
  fullscreenable = true,
  defaultFullscreen = false,
  closeOnOverlayClick = false,
  overlayZIndex = 9999,
  children,
}) => {
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);
  const { width: winW, height: winH } = useWindowSize();
  const isMobile = winW < MOBILE_BREAKPOINT;

  const rndRef = useRef(null);
  const userMovedRef = useRef(false);

  const toggleFullscreen = useCallback(() => setFullscreen((p) => !p), []);

  const modalSize = useMemo(() => {
    const base = typeof size === "object" ? size : SIZES[size] || SIZES.md;
    const rawHeight =
      isMobile && base.mobileHeight ? base.mobileHeight : base.height;
    return {
      width: Math.min(base.width, winW - 20),
      height: rawHeight === "auto" ? "auto" : Math.min(rawHeight, winH - 20),
    };
  }, [size, winW, winH, isMobile]);

  const isAutoHeight = modalSize.height === "auto";

  const position = {
    x: Math.max((winW - modalSize.width) / 2, 0),
    y: isAutoHeight ? 0 : Math.max((winH - modalSize.height) / 2, 0),
  };

  // وقتی ارتفاع auto است، بعد از اندازه‌گیری واقعی مدال را وسط صفحه می‌گذارد
  // و تا وقتی کاربر درگ نکرده با تغییر ارتفاع محتوا (لود ویدیو، متن و...) وسط نگه می‌دارد
  useLayoutEffect(() => {
    if (!open || fullscreen || !isAutoHeight) return;
    const el = rndRef.current?.resizableElement?.current;
    if (!el) return;

    userMovedRef.current = false;

    const center = () => {
      if (userMovedRef.current) return;
      const y = Math.max((winH - el.offsetHeight) / 2, 0);
      rndRef.current?.updatePosition({ x: position.x, y });
    };

    center();

    const observer = new ResizeObserver(center);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, fullscreen, isAutoHeight, winH, position.x]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const canDrag = !fullscreen && draggable && !isMobile;

  const content =
    typeof children === "function"
      ? children({ isFullscreen: fullscreen, toggleFullscreen })
      : children;

  const header = (
    <Header
      loading={loading}
      title={title}
      setOpenEducation={onClose}
      isFullscreen={fullscreen}
      onToggleFullscreen={fullscreenable ? toggleFullscreen : undefined}
    />
  );

  return createPortal(
    <Overlay
      $zIndex={overlayZIndex}
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
      }}
    >
      {fullscreen ? (
        <FullscreenPanel>
          <HeaderWrap>{header}</HeaderWrap>
          <Content>{content}</Content>
        </FullscreenPanel>
      ) : (
        <StyledRnd
          ref={rndRef}
          default={{ ...position, ...modalSize }}
          size={modalSize}
          bounds="parent"
          enableResizing={false}
          disableDragging={!canDrag}
          dragHandleClassName={DRAG_HANDLE}
          cancel={CANCEL_SELECTOR}
          onDragStart={() => {
            userMovedRef.current = true;
          }}
        >
          <HeaderWrap className={DRAG_HANDLE} $draggable={canDrag}>
            {header}
          </HeaderWrap>
          <Content>{content}</Content>
        </StyledRnd>
      )}
    </Overlay>,
    document.body,
  );
};

export default FullModal;
