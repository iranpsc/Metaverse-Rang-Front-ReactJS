// عنوان (تایتل) استاندارد برای همه‌ی تایتل‌ها و لیبل اینپوت‌های داخل مدال‌ها؛ با size="small" برای متن‌های کوچک‌تر و size="big" برای عنوان‌های درشت‌تر (پراپ قدیمی small هم کار می‌کند)

import styled from "styled-components";
import { getSize } from "../styles/sizes";


const getColor = ({ theme, $gray, $gray2 }) => {
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
  gray2,
  weight = 400,
}) => (
  <TitleName
    $weight={weight}
    $payed={payed}
    $size={size ?? (small ? "small" : "default")}
    $noWrap={noWrap}
    $gray={gray}
    $gray2={gray2}
  >
    {title}
  </TitleName>
);

export default TitleBody;