import styled, { css } from "styled-components";
import TitleBody from "./TitleBody";
import { convertToPersian, fixNumbers } from "../services/Utility";
import { getSize } from "../styles/sizes";

const INVALID_BORDER = "red";

// استایل فیلد وقتی مرورگر مقدار پیشنهادی (autofill) را پر می‌کند
const autofillStyle = css`
  -webkit-text-fill-color: ${({ theme }) =>
    theme.colors.newColors.shades.title};
  caret-color: ${({ theme }) => theme.colors.newColors.shades.title};
  -webkit-box-shadow: 0 0 0 1000px
    ${({ theme }) => theme.colors.newColors.otherColors.inputBg} inset;
  box-shadow: 0 0 0 1000px
    ${({ theme }) => theme.colors.newColors.otherColors.inputBg} inset;
  transition: background-color 9999s ease-in-out 0s;
`;

const Field = styled.div`
  width: ${({ $width }) => $width};
  max-width: 100%;
`;

const InputBox = styled.div`
  position: relative;
`;

const InputElement = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  padding-inline-end: ${({ $hasSuffix }) => ($hasSuffix ? "36px" : "12px")};
  font-size: ${({ $size }) => getSize($size, "base")};
  font-weight: 400;
  outline: none;
  border: 1px solid
    ${({ $error, theme }) =>
      $error ? INVALID_BORDER : theme.colors.newColors.otherColors.inputBorder};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }

  /* WebKit / Blink */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    ${autofillStyle}
  }

  /* Firefox و استاندارد جدید */
  &:autofill {
    ${autofillStyle}
  }
`;

const Suffix = styled.span`
  position: absolute;
  top: 50%;
  inset-inline-end: 12px;
  transform: translateY(-50%);
  font-size: ${({ $size }) => getSize($size, "base")};
  color: ${({ theme }) => theme.colors.newColors.otherColors.gray};
  pointer-events: none;

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;

const LabeledInput = ({
  label,
  placeholder,
  value = "",
  onChange,
  type = "text",
  maxLength = 50,
  error = false,
  suffix,
  width = "100%",
  disabled,
  inputMode,
  size = "default",
}) => {
  const isNumeric = type === "number";

  const handleChange = (e) => {
    if (isNumeric) {
      e.target.value = fixNumbers(e.target.value).replace(/\D/g, "");
    }
    onChange?.(e);
  };

  return (
    <Field $width={width}>
      {label && <TitleBody title={label} size={size} />}

      <InputBox>
        <InputElement
          type={isNumeric ? "text" : type}
          inputMode={isNumeric ? "numeric" : inputMode}
          placeholder={placeholder}
          value={isNumeric ? convertToPersian(value) : value}
          onChange={handleChange}
          maxLength={maxLength}
          aria-label={label || placeholder}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          $size={size}
          $error={error}
          $hasSuffix={Boolean(suffix)}
        />
        {suffix && <Suffix $size={size}>{suffix}</Suffix>}
      </InputBox>
    </Field>
  );
};

export default LabeledInput;
