import house from "../../../../../assets/images/house.png";
import styled from "styled-components";
import Button from "../../../../../components/Button";
import { getTranslation } from "../../../../../services/Utility";
import { useLocation, useNavigate } from "react-router";

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-height: 768px) {
    gap: 10px;
  }
`;

const Image = styled.div`
  height: 80px;
  width: 80px;
  flex-shrink: 0;
  border-radius: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.orange + "35"};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
  }

  @media (max-height: 768px) {
    height: 56px;
    width: 56px;
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
  }

  h3 {
    font-size: 14px;
    font-weight: 400;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    opacity: 0.7;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.newColors.shades.title};
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
    color: ${(props) => props.theme.colors.newColors.otherColors.orange};
    cursor: pointer;
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

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  padding: 10px 10px 10px 20px;
  border-radius: 5px;
  gap: 20px;
  white-space: nowrap;

  @media (max-height: 768px) {
    padding: 10px;
    gap: 10px;
  }

  @media (max-width: 780px) {
    flex-wrap: wrap;
  }
`;

const PropertyCard = ({ onClick, label, propertyId, id, stability }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <Right>
        <Image>
          <img src={house} alt="property" />
        </Image>
        <Info>
          <h3>{getTranslation(810)}</h3>
          <h4
            onClick={() =>
              navigate(`/feature/${id}/info`, {
                state: { from: location.pathname },
              })
            }
          >
            {propertyId}
          </h4>
        </Info>
      </Right>

      <Center>
        <h3>{getTranslation(373)}</h3>
        <h4>{stability}</h4>
      </Center>

      <ButtonWrapper>
        <Button label={label} onclick={() => onClick(id)} />
      </ButtonWrapper>
    </Container>
  );
};

export default PropertyCard;