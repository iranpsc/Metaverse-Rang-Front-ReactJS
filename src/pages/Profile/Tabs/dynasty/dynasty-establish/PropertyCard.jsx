// کارت یک ملک برای انتخاب در ساخت سلسله (عکس، کد ملک، پایداری و دکمه‌ی انتخاب)؛ مناسب لیست املاک صفحه‌ی PropertySelect

import styled from "styled-components";
import house from "../../../../../assets/images/house.png";
import Button from "../../../../../components/Button";
import LandText from "../../../../../components/LandText";
import TitleBody from "../../../../../components/TitleBody";
import { getTranslation } from "../../../../../services/Utility";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
  padding: 10px 10px 10px 20px;
  border-radius: 5px;
  white-space: nowrap;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (max-height: 768px) {
    gap: 10px;
    padding: 10px;
  }

  @media (max-width: 780px) {
    flex-wrap: wrap;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-height: 768px) {
    gap: 10px;
  }
`;

const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    `${theme.colors.newColors.otherColors.orange}35`};

  img {
    width: 50px;
    height: 50px;
  }

  @media (max-height: 768px) {
    width: 56px;
    height: 56px;
    padding: 8px;

    img {
      width: 36px;
      height: 36px;
    }
  }
`;

const ButtonWrapper = styled.div`
  @media (max-width: 780px) {
    flex-basis: 100%;
  }
`;

const PropertyCard = ({ onClick, label, propertyId, id, stability }) => (
  <Container>
    <Right>
      <Image>
        <img src={house} alt="" />
      </Image>

      <div>
        <TitleBody noWrap title={getTranslation(810)} />
        <LandText label={propertyId} to={`/feature/${id}/info`} />
      </div>
    </Right>

    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TitleBody noWrap title={getTranslation(373)} />
      <TitleBody title={stability} />
    </div>

    <ButtonWrapper>
      <Button full label={label} onClick={() => onClick?.(id)} />
    </ButtonWrapper>
  </Container>
);

export default PropertyCard;
