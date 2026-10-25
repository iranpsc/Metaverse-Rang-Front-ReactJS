// کامپوننت نمایش خطا به صورت متن قرمز، معمولاً زیر ورودی‌ها (مثل آپلود تصویر) استفاده می‌شود.
// لیست خطاها را نشان می‌دهد، در صورت دادن containerRef به آن اسکرول می‌کند و با onClear بعد از ۵ ثانیه خطاها را پاک می‌کند.
import { useEffect, useRef } from "react";
import styled from "styled-components";

const AUTO_CLEAR_DELAY = 5000;

const ErrorList = styled.ul`
  width: 90%;
  padding: 5px 0;
  color: red;
  list-style: none;
`;

export default function ErrorMessage({
  errors = [],
  maxList,
  style,
  onClear,
  containerRef,
}) {
  const listRef = useRef(null);
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  const messages = Array.isArray(errors)
    ? errors.filter((e) => typeof e === "string" && e.trim() !== "")
    : [];
  const hasError = messages.length > 0;

  useEffect(() => {
    if (!hasError) return;

    const container = containerRef?.current;
    const list = listRef.current;

    if (container && list) {
      container.scrollTo({
        top: list.offsetTop - container.offsetTop,
        behavior: "smooth",
      });
    }

    if (!onClearRef.current) return;

    const timer = setTimeout(() => onClearRef.current?.(), AUTO_CLEAR_DELAY);
    return () => clearTimeout(timer);
  }, [hasError, containerRef]);

  if (!hasError) return null;

  return (
    <ErrorList ref={listRef}>
      {messages.slice(0, maxList).map((error, index) => (
        <li key={`${index}-${error}`} style={style}>
          {error}
        </li>
      ))}
    </ErrorList>
  );
}
