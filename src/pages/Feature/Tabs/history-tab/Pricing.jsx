import psc from "../../../../assets/gif/psc.gif";
import rial from "../../../../assets/gif/rial.gif";
import blue from "../../../../assets/gif/blue-color.gif";
import red from "../../../../assets/gif/red-color.gif";
import yellow from "../../../../assets/gif/yellow-color.gif";
import TitleBody from "../../../../components/TitleBody";
import styled from "styled-components";
import { convertToPersian, getTranslation } from "../../../../services/Utility";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    align-items: center;
    gap: 3px;
  }
`;

const Pricing = ({ type, amount, color, index, gift }) => {
  const colorImages = {
    red,
    blue,
    yellow,
  };
  const icons = {
    rial,
    psc,
    color: colorImages[color],
  };
  return (
    <Container>
      <div>
        <TitleBody gray small title={getTranslation(770)} />
        {!(index === 2 && amount === 0) && (
          <img src={icons[type]} alt={type} width={18} height={18} />
        )}
      </div>

      <TitleBody
        title={
          gift && index === 2 ? getTranslation(157) : convertToPersian(amount)
        }
      />
    </Container>
  );
};

export default Pricing;
