import styled, { css } from "styled-components";
import { responsiveFontSize } from "../styles/sizes.js";

// نسخه قرصی دکمه آیکون‌دار
const pillVariant = css`
  gap: 5px;
  padding: 3px 12px;
  border-radius: 60px;

  svg {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    padding: 10px 12px;
  }
`;

// استایل نسخه آیکون‌دار
const iconVariant = css`
  flex-grow: ${({ $grow }) => ($grow ? 1 : 0)};
  height: auto;
  padding: 2px 20px 1px;
  border-radius: 7px;
  gap: 10px;

  ${({ $fill, color, grayTheme, theme }) =>
    !color &&
    !grayTheme &&
    css`
      background-color: ${$fill
        ? theme.colors.primary
        : theme.colors.newColors.otherColors.btnIconBg};
      color: ${$fill
        ? theme.colors.newColors.primaryText
        : theme.colors.newColors.otherColors.btnIconText};
    `}

  svg {
    display: flex;
    font-size: 18px;
  }

  @media (min-width: 998px) {
    height: auto;
  }

  @media (min-width: 1024px) {
    padding: 7px 20px 4px;
  }

  ${({ $pill }) => $pill && pillVariant}
`;

const ButtonElement = styled.button`
  border-radius: 10px;
  white-space: nowrap;

  background-color: ${({ color, disabled, grayTheme, theme }) =>
    color
      ? disabled === "pending"
        ? color
        : disabled
          ? `${color}80`
          : color
      : grayTheme
        ? theme.colors.newColors.otherColors.garyBtn
        : disabled === "pending"
          ? theme.colors.primary
          : disabled
            ? `${theme.colors.primary}80`
            : theme.colors.primary};

  border: none;
  padding: ${({ large }) => (large ? "0 20px" : "10px 22px")};

  width: ${({ fit, edit, large, full }) =>
    fit
      ? "fit-content"
      : edit
        ? "125px"
        : large
          ? "fit-content"
          : full
            ? "100%"
            : "fit-content"};

  height: 45px;
  font-weight: 500;
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  color: ${({ disabled, grayTheme, theme }) =>
    disabled === "pending"
      ? theme.colors.newColors.primaryText
      : grayTheme
        ? theme.colors.newColors.otherColors.grayBtnText
        : theme.colors.newColors.primaryText};

  color: ${({ textColor }) => textColor || "inherit"};

  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  opacity: ${({ disabled }) =>
    disabled === "pending" ? "0.6" : disabled ? "0.5" : "1"};

  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  @media (max-width: 840px) {
    width: ${({ row, full }) => (row ? "55px" : full ? "100%" : "fit-content")};

    height: ${({ row }) => (row ? "35px" : "45px")};
    font-size: ${({ row }) => (row ? "14px" : "16px")};
  }

  @media (min-width: 998px) {
    height: ${({ large }) => (large ? "40px" : "50px")};
  }

  ${({ $withIcon }) => $withIcon && iconVariant}
`;

const Label = styled.span`
  ${responsiveFontSize}
  font-weight: 500;

  ${({ $pill }) =>
    $pill &&
    css`
      font-size: 16px;
      font-weight: 700;
    `}
`;

// اسپینر دایره‌ای
const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

// نمایش آیکون به‌صورت المنت یا تصویر
const renderIcon = (icon) =>
  typeof icon === "string" ? (
    <img src={icon} alt="" width={18} height={18} />
  ) : (
    icon
  );

// دکمه عمومی پروژه
const Button = ({
  label,
  pill,
  onclick,
  onClick,
  row,
  color,
  edit,
  large,
  full,
  disabled,
  fit,
  textColor,
  grayTheme,
  style,
  icon,
  fill,
  grow,
  size = "default",
}) => {
  const handleClick = onClick || onclick;

  return (
    <ButtonElement
      full={full}
      large={large}
      edit={edit}
      row={row}
      color={color}
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
      fit={fit}
      textColor={textColor}
      grayTheme={grayTheme}
      style={style}
      $withIcon={Boolean(icon)}
      $fill={fill}
      $grow={grow}
      $pill={pill}
    >
      {icon && <span>{renderIcon(icon)}</span>}

      {icon ? (
        <Label $size={size} $pill={pill}>
          {label}
        </Label>
      ) : (
        label
      )}

      {disabled === "pending" && <Spinner />}
    </ButtonElement>
  );
};

export default Button;
