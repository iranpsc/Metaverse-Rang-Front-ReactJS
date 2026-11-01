import styled, { css } from "styled-components";

const ButtonElement = styled.button`
  border-radius: 10px;
  white-space: nowrap;
  background-color: ${(props) =>
    props.color
      ? props.disabled === "pending"
        ? props.color // همان رنگ اصلی، فقط مات میشه
        : props.disabled
          ? `${props.color}80`
          : props.color
      : props.grayTheme
        ? props.theme.colors.newColors.otherColors.garyBtn
        : props.disabled === "pending"
          ? props.theme.colors.primary // رنگ اصلی، فقط مات میشه
          : props.disabled
            ? `${props.theme.colors.primary}80`
            : props.theme.colors.primary};
  border: none;
  padding: ${(props) => (props.large ? "0 20px" : "10px 22px")};
  width: ${(props) =>
    props.fit
      ? "fit-content"
      : props.edit
        ? "125px"
        : props.large
          ? "fit-content"
          : props.full
            ? "100%"
            : "fit-content"};
  height: 45px;
  font-weight: 500;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) =>
    props.disabled === "pending"
      ? props.theme.colors.newColors.primaryText
      : props.grayTheme
        ? props.theme.colors.newColors.otherColors.grayBtnText
        : props.theme.colors.newColors.primaryText};
  color: ${(props) => (props.textColor ? props.textColor : "")};
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${(props) =>
    props.disabled === "pending" ? "0.6" : props.disabled ? "0.5" : "1"};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  @media (max-width: 840px) {
    width: ${(props) => (props.row ? "55px" : props.full && "100%")};
    height: ${(props) => props.row && "35px"};
    font-size: ${(props) => props.row && "14px"};
  }

  @media (min-width: 998px) {
    height: ${(props) => (props.large ? "40px" : "50px")};
  }

  /* باید آخر بیاد تا روی استایل‌های بالا اولویت داشته باشه */
  ${({ $withIcon }) => $withIcon && iconVariant}
`;
// نسخه قرصی دکمه آیکون‌دار: گوشه‌ی کاملاً گرد، آیکون ۲۳ پیکسل و برچسب ۱۶ پیکسل درشت (مثل دکمه‌های عملیات روی نقشه)

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
// استایل نسخه آیکون‌دار (قبلاً ButtonIcon): کوتاه‌تر، گوشه ۷ پیکسل، پس‌زمینه btnIconBg یا primary با fill
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

const Label = styled.span`
  font-size: 10px;

  @media (min-width: 740px) {
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
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

// آیکون می‌تونه کامپوننت/المنت (مثل <FiUser />) یا آدرس تصویر (رشته) باشه
const renderIcon = (icon) =>
  typeof icon === "string" ? (
    <img src={icon} alt="" width={18} height={18} />
  ) : (
    icon
  );

// این کامپوننت دکمه عمومی همه بخش‌های پروژه است؛ دکمه ساده با label، و با پراپ icon (المنت یا آدرس تصویر) نسخه کوچک آیکون‌دار مثل دکمه‌های پروفایل رو نمایش میده (با fill رنگ اصلی و با grow کشیده شدن در فضای خالی)؛ با disabled="pending" اسپینر نشون میده
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
      {icon ? <Label>{label}</Label> : label}
      {disabled === "pending" && <Spinner />}
    </ButtonElement>
  );
};

export default Button;
