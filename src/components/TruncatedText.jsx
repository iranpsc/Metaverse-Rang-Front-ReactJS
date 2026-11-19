// متنی که وقتی به حداکثر فضا رسید با سه نقطه بریده می‌شود و فقط در حالت بریده‌شدن تولتیپ متن کامل را نشان می‌دهد؛ مناسب آدرس، نام و هر متن بلند داخل کارت یا لیست

import styled from "styled-components";
import { useLayoutEffect, useRef, useState } from "react";
import TitleBody from "./TitleBody.jsx";
import ToolTip from "./Tooltip/Tooltip.jsx";

const Clamp = styled.div`
  min-width: 0;
  width: calc(100% - ${({ $reserved }) => $reserved}px);

  & > * {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${({ $lines }) => $lines};
    overflow: hidden;
    overflow-wrap: anywhere;
  }
`;

const TruncatedText = ({ text, lines = 1, reservedSpace = 0 }) => {
  const ref = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current?.firstElementChild;
    if (!el) return;

    const check = () => setIsTruncated(el.scrollHeight > el.clientHeight);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, lines, reservedSpace]);

  return (
    <ToolTip
      content={text}
      place="top"
      width="auto"
      height="auto"
      disabled={!isTruncated}
      Chidren={
        <Clamp ref={ref} $lines={lines} $reserved={reservedSpace}>
          <TitleBody small title={text} />
        </Clamp>
      }
    />
  );
};

export default TruncatedText;