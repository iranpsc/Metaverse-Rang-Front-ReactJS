// برای تایتل هدر کامپوننت‌ها استفاده می‌شود و جهت ریسپانسیو درست لطفاً در همه‌جای پروژه از این کامپوننت استفاده کنید؛ با پراپ noMargin بدون هیچ مارجینی نمایش داده می‌شود؛ با small کوچک‌تر و با big درشت‌تر می‌شود؛ رنگ مثل TitleBody با color، primary، gray و gray2 عوض می‌شود

import styled from "styled-components";
import { getTitleColor } from "../styles/getTitleColor";
const SIZES = {
  default: { base: "16px", tablet: "13px", desktop: "18px" },
  small: { base: "13px", tablet: "13px", desktop: "14px" },
  big: { base: "20px", tablet: "17px", desktop: "24px" },
};



const TitleName = styled.h3`
  margin: ${({ $noMargin, $payed }) =>
    $noMargin ? "0" : `${$payed ? "30px" : "0"} 0 20px`};
  font-size: ${({ $size }) => SIZES[$size].base};
  font-weight: 600;
  text-align: ${({ $center }) => ($center ? "center" : "")};
  color: ${getTitleColor};

  @media (min-width: 500px) and (max-width: 1000px) {
    font-size: ${({ $size }) => SIZES[$size].tablet};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => SIZES[$size].desktop};
  }
`;

const TitleHeader = ({
  title,
  payed,
  small,
  big,
  center,
  noMargin,
  color,
  primary,
  gray,
  gray2,
}) => (
  <TitleName
    $payed={payed}
    $size={big ? "big" : small ? "small" : "default"}
    $center={center}
    $noMargin={noMargin}
    $color={color}
    $primary={primary}
    $gray={gray}
    $gray2={gray2}
  >
    {title}
  </TitleName>
);

export default TitleHeader;
