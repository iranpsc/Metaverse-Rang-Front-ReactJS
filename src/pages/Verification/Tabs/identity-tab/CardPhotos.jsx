import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody";
const ImageWrapper = styled.div`
  width: 220px;
  height: 140px;
  overflow: hidden;
  border-radius: 10px;
  margin-top: 15px;
  @media (min-width: 1500px) {
    width: 283px;
    height: 200px;
  }
  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
`;
const CardPhotos = ({ nationalCardImg }) => {
  return (
    <Container>
      <div>
        <TitleBody title={getTranslation("878")} />

        <ImageWrapper>
          <img src={nationalCardImg} alt="nation" />
        </ImageWrapper>
      </div>
    </Container>
  );
};

export default CardPhotos;
