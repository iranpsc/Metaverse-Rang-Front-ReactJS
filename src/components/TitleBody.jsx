// عنوان (تایتل) استاندارد برای همه‌ی تایتل‌ها و لیبل اینپوت‌های داخل مدال‌ها؛ با size="small" برای متن‌های کوچک‌تر و size="big" برای عنوان‌های درشت‌تر (پراپ قدیمی small هم کار می‌کند)

import styled from "styled-components";

const SIZES = {
  default: { base: "14px", tablet: "12px", desktop: "16px" },
  small: { base: "12px", tablet: "12px", desktop: "13px" },
  big: { base: "16px", tablet: "14px", desktop: "18px" },
};

const getSize = ($size, key) => SIZES[$size][key];
const TitleName = styled.h4`
  color: ${({ theme, $gray }) =>
    $gray
      ? theme.colors.newColors.otherColors.gray
      : theme.colors.newColors.shades.title};
  font-size: ${({ $size }) => getSize($size, "base")};
  font-weight: ${({ $weight }) => $weight};
  margin: 0;
  margin-top: ${({ $payed }) => ($payed ? "20px" : "0")};
  padding-bottom: 2px;
  white-space: ${({ $noWrap }) => ($noWrap ? "nowrap" : "normal")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;

const TitleBody = ({
  title,
  payed,
  small,
  noWrap,
  size,
  gray,
  weight = 400,
}) => (
  <TitleName
    $weight={weight}
    $payed={payed}
    $size={size ?? (small ? "small" : "default")}
    $noWrap={noWrap}
    $gray={gray}
  >
    {title}
  </TitleName>
);

export default TitleBody;