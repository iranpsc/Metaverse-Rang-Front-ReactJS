//باکس جستجو که باید در کل پروژه از همین استفاده شود
import { FiSearch } from "react-icons/fi";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";

const Container = styled.div`
  height: 50px;
  border-radius: 5px;
  border: 1px solid #454545;
  padding: 5px 12px;
  color: #84858f;

  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  display: grid;
  align-items: center;
  grid-template-columns: 5px 1fr;
  gap: 50px;

  svg {
    background-color: ${(props) =>
      props.theme.colors.newColors.otherColors.inputBg};
  }

  input {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    height: 100%;
    background: transparent;
    font-size: 18px;
    width: 100%;
    outline: none;
    border: none;
  }
`;

const SearchInput = ({ placeholder, value = "", onchange }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      onchange?.({ target: { value } });
    }, 500),
    [onchange],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const value = e.target.value;

    setInputValue(value);

    debouncedSearch(value);
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
