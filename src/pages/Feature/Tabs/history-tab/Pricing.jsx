import TitleBody from "../../../../components/TitleBody";
import styled from "styled-components";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig.js";

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
    red: COLOR_CONFIG.red.gif,
    blue: COLOR_CONFIG.blue.gif,
    yellow: COLOR_CONFIG.yellow.gif,
  };
  const icons = {
    rial: COLOR_CONFIG.irr.gif,
    psc: COLOR_CONFIG.psc.gif,
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
