// فیلد ورودی عمومی با لیبل بالا، آیکون یا متن ابتدا و انتها (prefix و suffix)، متن واحد بلافاصله بعد از مقدار (unit، مثل «دقیقه»)، حالت عددی با ارقام فارسی، بردر قرمز خطا و عرض به اندازه‌ی تعداد رقم (digits)؛ مناسب فرم‌ها و باکس جستجو

import styled, { css } from "styled-components";
import TitleBody from "./TitleBody";
import { convertToPersian, convertToEnglish } from "../services/Utility";
import {inputFontSize,responsiveFontSize  } from "../styles/sizes";

const INVALID_BORDER = "red";
const EDGE_GAP = 12; // فاصله‌ی آیکون و متن کناری از لبه‌ی فیلد
const BORDER_WIDTH = 1;
const DEFAULT_ADORNMENT_WIDTH = 24;
const DEFAULT_MAX_LENGTH = 50;

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
  padding-block: 10px;
  padding-inline: ${({ $paddingStart }) => $paddingStart}px
    ${({ $paddingEnd }) => $paddingEnd}px;
  text-align: start;
  font-family: inherit;
  font-weight: 400;
  outline: none;
  border: ${BORDER_WIDTH}px solid
    ${({ $error, theme }) =>
      $error ? INVALID_BORDER : theme.colors.newColors.otherColors.inputBorder};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  ${inputFontSize}

  /* عرض به اندازه‌ی تعداد رقم‌ها؛ padding و border بیرون از آن اضافه می‌شوند */
  ${({ $digits }) =>
    $digits &&
    css`
      box-sizing: content-box;
      width: ${$digits}ch;
      text-align: center;
    `}

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
   @media (max-width: 1000px) {
   padding-block: 6px;
  }
`;

const Adornment = styled.span`
  position: absolute;
  top: 50%;
  inset-inline-${({ $side }) => $side}: ${EDGE_GAP}px;
  transform: translateY(-50%);
  display: flex;
  width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  color: ${({ theme }) => theme.colors.newColors.otherColors.gray};
  pointer-events: none;
  ${responsiveFontSize}
`;

// متن واحد از همان نقطه‌ای شروع می‌شود که متن فیلد شروع می‌شود و بعد از کپی نامرئی مقدار می‌آید
const Unit = styled.span`
  position: absolute;
  top: 50%;
  inset-inline-start: ${({ $offset }) => $offset}px;
  transform: translateY(-50%);
  display: flex;
  gap: 4px;
  font-weight: 400;
  white-space: pre;
  color: ${({ theme }) => theme.colors.newColors.otherColors.gray};
  pointer-events: none;
  ${inputFontSize}
`;

const Mirror = styled.span`
  visibility: hidden;
`;

const LabeledInput = ({
  label,
  placeholder,
  value = "",
  onChange,
  type = "text",
  maxLength,
  error = false,
  prefix, // آیکون یا متن کنار ابتدای فیلد
  prefixSide = "start",
  prefixWidth, // عرض به پیکسل؛ پیش‌فرض ۲۴
  suffix, // آیکون یا متن کنار انتهای فیلد
  suffixSide = "end",
  suffixWidth,
  unit, // متنی که بلافاصله بعد از مقدار نمایش داده می‌شود؛ برای نشان ندادن، false یا خالی بدهید
  width = "100%",
  inputMode,
  size = "default", // "default" | "small" | "big"
  digits, // اگر داده شود (مثلاً 2 یا 3) عرض فیلد به اندازه‌ی همان تعداد رقم می‌شود
  "aria-label": ariaLabel,
  ...rest // disabled، name، onKeyDown، onPaste، autoComplete، autoFocus و ...
}) => {
  const isNumeric = type === "number";
  const shownValue = isNumeric ? convertToPersian(value) : value;

  const adornments = [
    { node: prefix, side: prefixSide, width: prefixWidth },
    { node: suffix, side: suffixSide, width: suffixWidth },
  ].filter(({ node }) => node);

  // فاصله‌ی داخلی هر سمت؛ اگر آیکون یا متنی در آن سمت باشد برایش جا باز می‌شود
  const getPadding = (side) => {
    const adornment = adornments.find((item) => item.side === side);

    return adornment
      ? (adornment.width ?? DEFAULT_ADORNMENT_WIDTH) + EDGE_GAP * 2
      : EDGE_GAP;
  };

  // برای ورودی عددی ارقام فارسی و عربی به انگلیسی تبدیل و بقیه‌ی کاراکترها حذف می‌شوند
  const handleChange = (e) => {
    if (isNumeric) {
      e.target.value = convertToEnglish(e.target.value).replace(/\D/g, "");
    }
    onChange?.(e);
  };

  return (
    <Field $width={width}>
      {label && <TitleBody title={label} size={size} />}

      <InputBox>
        <InputElement
          {...rest}
          type={isNumeric ? "text" : type}
          inputMode={isNumeric ? "numeric" : inputMode}
          placeholder={placeholder}
          value={shownValue}
          onChange={handleChange}
          maxLength={maxLength ?? digits ?? DEFAULT_MAX_LENGTH}
          aria-label={ariaLabel ?? (label || placeholder)}
          aria-invalid={Boolean(error)}
          $size={size}
          $error={error}
          $digits={digits}
          $paddingStart={getPadding("start")}
          $paddingEnd={getPadding("end")}
        />

        {adornments.map(({ node, side, width: adornmentWidth }, index) => (
          <Adornment
            key={index}
            $size={size}
            $side={side}
            $width={adornmentWidth}
          >
            {node}
          </Adornment>
        ))}

        {unit && (
          <Unit $size={size} $offset={getPadding("start") + BORDER_WIDTH}>
            <Mirror aria-hidden="true">{shownValue}</Mirror>
            {unit}
          </Unit>
        )}
      </InputBox>
    </Field>
  );
};

export default LabeledInput;
