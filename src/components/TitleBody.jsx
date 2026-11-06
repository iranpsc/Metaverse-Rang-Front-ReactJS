// عنوان (تایتل) استاندارد برای همه‌ی تایتل‌ها و لیبل اینپوت‌های داخل مدال‌ها؛ با size="small" برای متن‌های کوچک‌تر و size="big" برای عنوان‌های درشت‌تر (پراپ قدیمی small هم کار می‌کند)

import styled from "styled-components";
import { getSize } from "../styles/sizes";

const getColor = ({ theme, $color, $gray, $gray2, $primary }) => {
  if ($color) return $color;
  if ($primary) return theme.colors.primary;

  const { otherColors, shades } = theme.colors.newColors;
  if ($gray2) return shades.matn2;
  if ($gray) return otherColors.gray;
  return shades.title;
};
const TitleName = styled.h4`
  color: ${getColor};
  font-size: ${({ $size }) => getSize($size, "base")};
  font-weight: ${({ $weight }) => $weight};
  margin: 0;
  margin-top: ${({ $payed }) => ($payed ? "20px" : "0")};
  padding-bottom: 2px;
  white-space: ${({ $noWrap }) => ($noWrap ? "nowrap" : "normal")};
  ${({ $align }) => $align && `text-align: ${$align};`}

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
  big,
  noWrap,
  size,
  color,
  gray,
  gray2,
  align,
  weight = 400,
  primary,
}) => (
  <TitleName
    $primary={primary}
    $weight={weight}
    $payed={payed}
    $size={size ?? (big ? "big" : small ? "small" : "default")}
    $noWrap={noWrap}
    $color={color}
    $gray={gray}
    $gray2={gray2}
    $align={align}
  >
    {title}
  </TitleName>
);

export default TitleBody;
