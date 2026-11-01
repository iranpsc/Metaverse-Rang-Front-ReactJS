// باکس جستجوی استاندارد با debounce داخلی؛ مناسب همه‌ی لیست‌ها و صفحه‌هایی که سرچ دارند و در کل پروژه باید از همین استفاده شود

import styled from "styled-components";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import debounce from "lodash/debounce";

const DEBOUNCE_MS = 500;

const Container = styled.div`
  display: grid;
  grid-template-columns: 5px 1fr;
  align-items: center;
  gap: 50px;
  height: 50px;
  padding: 5px 12px;
  border: 1px solid #454545;
  border-radius: 5px;
  color: #84858f;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const SearchInput = ({ placeholder, value = "", onchange }) => {
  const [inputValue, setInputValue] = useState(value);

  // همیشه آخرین onchange استفاده می‌شود، بدون اینکه debounce از نو ساخته شود
  const onChangeRef = useRef(onchange);
  // آخرین مقداری که به والد فرستاده شده؛ برای تشخیص تغییر خارجی value
  const lastEmitted = useRef(value);

  useEffect(() => {
    onChangeRef.current = onchange;
  }, [onchange]);

  const debouncedEmit = useMemo(
    () =>
      debounce((next) => {
        lastEmitted.current = next;
        onChangeRef.current?.({ target: { value: next } });
      }, DEBOUNCE_MS),
    [],
  );

  useEffect(() => () => debouncedEmit.cancel(), [debouncedEmit]);

  // فقط وقتی والد مقدار را از بیرون عوض کرد (مثلاً ریست) اینپوت همگام می‌شود
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const next = e.target.value;
    setInputValue(next);
    debouncedEmit(next);
  };

  return (
    <Container>
      <FiSearch size={34} />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
      />
    </Container>
  );
};

export default SearchInput;
