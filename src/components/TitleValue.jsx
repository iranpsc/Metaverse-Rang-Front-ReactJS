import styled from "styled-components";
import TitleBody from "./TitleBody";
import {
  ConvertJalali,
  convertToPersian,
  DATE_PATTERN,
} from "../services/Utility";

const EMPTY = "";

// آیدی‌هایی مثل to11-9 یا HM-2000241: حروف لاتین در ابتدا، بعد عدد و خط‌تیره
const ID_PATTERN = /^[a-z]+-?\d+(-\d+)*$/i;

const toEnglishDigits = (text) =>
  text
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

// LRI/PDI: جلوی جابه‌جا شدن بخش‌های آیدی در متن راست‌به‌چپ را می‌گیرد
const LRI = "\u2066";
const PDI = "\u2069";

const formatId = (text) => `${LRI}${text.toUpperCase()}${PDI}`;

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return EMPTY;

  const text = toEnglishDigits(String(value).trim());

  if (ID_PATTERN.test(text)) return formatId(text);

  return DATE_PATTERN.test(value)
    ? ConvertJalali(value)
    : convertToPersian(value);
};
const Wrapper = styled.div`
  display: flex;
  min-width: 0;
  ${({ $wrap }) => ($wrap ? "min-height: 40px;" : "height: 40px;")}
  ${({ $full }) => $full && "flex: 1 1 auto;"}
  overflow: hidden;
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  border-radius: 5px;

  @media (min-width: 998px) {
    ${({ $wrap }) => ($wrap ? "min-height: 48px;" : "height: 48px;")}
  }
`;
// سلول عنوان پس‌زمینه می‌گیرد و سلول مقدار شفاف است
const Cell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: ${({ $wrap }) => ($wrap ? "6px 10px" : "0 10px")};
  background-color: ${({ $filled, theme }) =>
    $filled ? theme.colors.newColors.otherColors.inputBg : "transparent"};

  @media (min-width: 998px) {
    padding: ${({ $wrap }) => ($wrap ? "6px 20px" : "0 20px")};
  }
`;

const IconBox = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: 20px;

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
`;

// icon می‌تواند نود ری‌اکت (آیکون) یا آدرس تصویر (رشته) باشد
const renderIcon = (icon) =>
  icon ? (
    <IconBox>
      {typeof icon === "string" ? <img src={icon} alt="" /> : icon}
    </IconBox>
  ) : null;

const TitleValue = ({
  title,
  value,
  icon,
  full = false,
  long = false,
  wrap = false,
}) => (
  <Wrapper $wrap={wrap} $full={full || long}>
    <Cell $filled $wrap={wrap}>
      {renderIcon(icon)}
      <TitleBody noWrap title={title} />
    </Cell>
    <Cell $wrap={wrap}>
      <TitleBody noWrap={!wrap} title={formatValue(value)} />
    </Cell>
  </Wrapper>
);
export default TitleValue;
