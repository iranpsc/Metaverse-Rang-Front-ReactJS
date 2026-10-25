import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguageContext.js";
import { convertToPersian } from "../services/Utility";
const Wrapper = styled.div`
  position: relative;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  overflow: hidden;
  border-radius: 5px;
  height: 40px;
  padding: 0 10px;
  display: flex;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  width: 100%;
  @media (min-width: 998px) {
  min-height: 50px;
  }
`;

const InputElement = styled.input`
  outline: none;
  border: none;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  width: 100%;
  height: 100%;
  font-size: 16px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Span = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 5px;

  ${(props) => (props.isPersian ? "left: 10px;" : "right: 10px;")}
  top: 5px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  @media (min-width: 998px) {
    top: 10px;
  }
`;
const Input = ({
  type = "text",
  placeholder,
  insideText,
  value = "",
  gif,
  onChange,
  disabled,
  name,
  maxLength,
  inputMode,
}) => {
  const isPersian = useLanguage();

  const displayValue = type === "number" ? convertToPersian(value) : value;

  const effectiveMaxLength =
    typeof maxLength === "number"
      ? maxLength
      : type === "number"
      ? undefined
      : 70;

  const handleChange = (e) => {
    let val = e.target.value;

    if (type === "number") {
      val = val.replace(/[^۰-۹0-9]/g, "");

      val = val.replace(/[۰-۹]/g, (d) =>
        String(d.charCodeAt(0) - "۰".charCodeAt(0))
      );
    }

    if (effectiveMaxLength) {
      val = val.slice(0, effectiveMaxLength);
    }

    onChange({
      ...e,
      target: { ...e.target, name, value: val },
    });
  };

  return (
    <Wrapper>
      <InputElement
        type={type === "number" ? "text" : type}
        inputMode={inputMode ?? (type === "number" ? "numeric" : undefined)}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        name={name}
      />
      <Span isPersian={isPersian}>
        {insideText}
        {gif && (
          <img width={30} height={30} loading="lazy" src={gif} alt="gif" />
        )}
      </Span>
    </Wrapper>
  );
};

export default Input;
