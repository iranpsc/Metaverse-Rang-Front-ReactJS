import styled from "styled-components";
import TitleBody from "../../../../components/TitleBody";
import { convertToPersian, formatAmount } from "../../../../services/Utility";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 14px 24px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 1024px) {
    padding: 16px 32px;
  }
  @media (min-width: 1280px) {
    padding: 12px 22px;
  }
`;

const Icon = styled.img`
  width: 38px;
  height: 38px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

// این کامپوننت برای نمایش یک کارت رنگ/موجودی کیف پول (گیف، عنوان و مقدار فارسی‌شده و فرمت‌شده) در بخش رنگ‌های پروفایل استفاده میشه
const ColorCard = ({ gif, label, value }) => (
  <Container>
    <Icon loading="lazy" alt={label} src={gif} />
    <Info>
      <TitleBody noWrap title={label} />
      <TitleBody title={convertToPersian(formatAmount(value))} />
    </Info>
  </Container>
);

export default ColorCard;
