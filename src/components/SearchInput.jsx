// باکس جستجوی استاندارد با debounce داخلی؛ مناسب همه‌ی لیست‌ها و صفحه‌هایی که سرچ دارند و در کل پروژه باید از همین استفاده شود
// کاراکترهای نامرئی هنگام تایپ/paste پاک می‌شوند؛ paste و Enter بدون انتظار debounce ارسال می‌شوند

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import debounce from "lodash/debounce";
import { stripInvisibleChars } from "../services/Utility";
import LabeledInput from "./LabeledInput";

const DEBOUNCE_MS = 500;

const SearchInput = ({ placeholder, value = "", onchange, onSearch }) => {
  const [inputValue, setInputValue] = useState(value);

  // همیشه آخرین کال‌بک‌ها استفاده میشن، بدون اینکه debounce از نو ساخته بشه
  const onChangeRef = useRef(onchange);
  const onSearchRef = useRef(onSearch);
  // آخرین مقداری که به والد فرستاده شده؛ برای تشخیص تغییر خارجی value
  const lastEmitted = useRef(value);

  useEffect(() => {
    onChangeRef.current = onchange;
    onSearchRef.current = onSearch;
  }, [onchange, onSearch]);

  const emit = useCallback((next) => {
    lastEmitted.current = next;
    onChangeRef.current?.({ target: { value: next } });
  }, []);

  const debouncedEmit = useMemo(() => debounce(emit, DEBOUNCE_MS), [emit]);

  useEffect(() => () => debouncedEmit.cancel(), [debouncedEmit]);

  // فقط وقتی والد مقدار را از بیرون عوض کرد (مثلاً ریست) اینپوت همگام میشه
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setInputValue(value);
    }
  }, [value]);

  // ارسال فوری (بدون debounce)
  const flush = useCallback(
    (next) => {
      debouncedEmit.cancel();
      setInputValue(next);
      emit(next);
      onSearchRef.current?.(next.trim());
    },
    [debouncedEmit, emit],
  );

  const handleChange = (e) => {
    const next = stripInvisibleChars(e.target.value);
    setInputValue(next);
    debouncedEmit(next);
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = stripInvisibleChars(e.clipboardData.getData("text"));
    const { selectionStart, selectionEnd } = e.target;
    const next =
      inputValue.slice(0, selectionStart) +
      pasted +
      inputValue.slice(selectionEnd);

    flush(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") flush(inputValue);
  };

  return (
    <LabeledInput
      prefix={<FiSearch size={24} />}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
    />
  );
};

export default SearchInput;
