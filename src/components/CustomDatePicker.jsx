// دیت‌پیکر شخصی‌سازی‌شده؛ مناسب هر فرم یا فیلتری که کاربر تاریخ یا بازه‌ی تاریخ انتخاب می‌کند؛ تقویم شمسی/میلادی با زبان صفحه عوض می‌شود؛ فونت، ارتفاع و آیکون با پراپ size هم‌اندازه‌ی LabeledInput و SearchInput است؛ در حالت تک‌تاریخ یک Date و در حالت range مقدار [شروع، پایان] به صورت Date برمی‌گردد؛ با error کادر قرمز می‌گیرد
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/yellow.css";
import DatePicker from "react-multi-date-picker";
import { FaRegCalendarAlt } from "react-icons/fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import styled, { css } from "styled-components";
import { useLanguage } from "../hooks/useLanguageContext.js";
import { useTheme } from "../hooks/useTheme.js";
import { getTranslation } from "../services/Utility";
import { getSize } from "../styles/sizes.js";

const DateContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 0 12px;
  overflow: hidden;
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? "red" : theme.colors.newColors.otherColors.inputBorder};
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  font-size: ${({ $size }) => getSize($size, "base")};

  svg {
    color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  }

  input {
    width: 100%;
    height: 100%;
    padding: 10px 12px;
    font-size: inherit;
    font-weight: 400;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }

  ${({ $disabled }) =>
    $disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}
`;

const CustomDatePicker = ({
  value,
  onChange,
  placeholder,
  format = "YYYY/MM/DD",
  range = false,
  plugins = [],
  minDate,
  maxDate,
  disabled = false,
  error = false,
  size = "default",
  width = "100%",
}) => {
  const language = useLanguage();
  const { theme } = useTheme();
  const isPersian = Boolean(language);

  const handleChange = (dates) => {
    if (!range) return onChange?.(dates?.toDate() ?? null);

    const [start, end] = (dates || []).map((d) => d.toDate());
    onChange?.([start || null, end || null]);
  };

  return (
    <DateContainer
      $size={size}
      $width={width}
      $disabled={disabled}
      $error={error}
    >
      <DatePicker
        placeholder={placeholder || getTranslation(564)}
        className={theme === "dark" ? "bg-dark yellow" : ""}
        format={format}
        calendar={isPersian ? persian : gregorian}
        locale={isPersian ? persian_fa : gregorian_en}
        calendarPosition={isPersian ? "bottom-right" : "bottom-left"}
        range={range}
        value={range ? value?.filter(Boolean) : value}
        onChange={handleChange}
        plugins={plugins}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
      />
      <FaRegCalendarAlt size="1.4em" />
    </DateContainer>
  );
};

export default CustomDatePicker;
