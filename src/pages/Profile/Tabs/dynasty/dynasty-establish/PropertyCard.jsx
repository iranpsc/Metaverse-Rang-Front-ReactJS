// کارت یک ملک برای انتخاب در ساخت سلسله (عکس، کد ملک، پایداری و دکمه‌ی انتخاب)؛ مناسب لیست املاک صفحه‌ی PropertySelect

import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import house from "../../../../../assets/images/house.png";
import Button from "../../../../../components/Button";
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

// استایل مشترک متن‌ها: h3 = عنوان، h4 = مقدار
const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3,
  h4 {
    margin: 0;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  h3 {
    font-size: 14px;
    font-weight: 400;
    opacity: 0.7;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
  }

  @media (max-height: 768px) {
    gap: 6px;

    h3 {
      font-size: 11px;
    }

    h4 {
      font-size: 13px;
    }
  }
`;

const Info = styled(TextBlock)`
  h4 {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.newColors.otherColors.orange};
  }
`;

const Center = styled(TextBlock)`
  text-align: center;
`;

const ButtonWrapper = styled.div`
  @media (max-width: 780px) {
    flex-basis: 100%;

    button,
    a {
      width: 100%;
    }
  }
`;

const PropertyCard = ({ onClick, label, propertyId, id, stability }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goToInfo = () =>
    navigate(`/feature/${id}/info`, { state: { from: pathname } });

  return (
    <Container>
      <Right>
        <Image>
          <img src={house} alt="" />
        </Image>

        <Info>
          <h3>{getTranslation(810)}</h3>
          <h4 onClick={goToInfo}>{propertyId}</h4>
        </Info>
      </Right>

      <Center>
        <h3>{getTranslation(373)}</h3>
        <h4>{stability}</h4>
      </Center>

      <ButtonWrapper>
        <Button label={label} onClick={() => onClick?.(id)} />
      </ButtonWrapper>
    </Container>
  );
};

export default PropertyCard;
