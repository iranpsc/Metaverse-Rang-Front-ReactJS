import styled from "styled-components";
import TitleBody from "../../../../components/TitleBody";
import { getTranslation, convertToPersian } from "../../../../services/Utility";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (min-width: 1024px) {
    align-items: flex-start;
  }
`;

const PropertyCard = ({ image, label, value, showUnit = true }) => {
  const displayValue = convertToPersian(value) || convertToPersian(0);
  const valueText = showUnit
    ? `${displayValue} ${getTranslation("150")}`
    : displayValue;

  return (
    <Container>
      <img width={40} height={40} loading="lazy" alt={label} src={image} />
      <Info>
        <TitleBody small title={label} />
        <TitleBody title={valueText} />
      </Info>
    </Container>
  );
};

export default PropertyCard;
