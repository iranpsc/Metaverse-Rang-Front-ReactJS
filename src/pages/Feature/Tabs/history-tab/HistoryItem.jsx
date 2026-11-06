import { HiOutlineUser } from "react-icons/hi";
import Pricing from "./Pricing";
import styled from "styled-components";
import TitleValue from "../../../Store/shop/TitleValue";
import {
  convertToPersian,
  getTranslation,
  ConvertJalali,
} from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody";
const UserTime = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  @media (max-width: 998px) {
    gap: 10px;
  }
`;
const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 10px;
  gap: 5px;

  display: grid;
  align-items: center;
  grid-template-columns: 3fr 2fr 2fr 2fr;
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Time = styled.div`
  width: 65px;
  height: 65px;
  display: grid;
  place-items: center;

  border-radius: 5px;
  background: ${({ theme }) => theme.colors.newColors.shades.bg2};
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  font-size: 20px;
  font-weight: 600;

  @media (max-width: 998px) {
    width: 80px;
    height: 80px;
    font-size: 18px;
  }
`;
const User = styled.div`
  h4 {
    color: ${({ theme }) => theme.colors.newColors.shades.title};

    font-size: 12px;
    a {
      color: #0066ff;
      text-decoration: none;
    }
  }
  @media (min-width: 998px) {
    h4 {
      font-size: 14px;
    }
  }
`;
const Div = styled.div`
  display: flex;
  margin-bottom: 4px;
  align-items: center;
  gap: 4px;
  color: #a0a0ab;
`;
const HistoryItem = ({
  index,
  user,
  link,
  owner,
  time,
  date,
  rial,
  psc,
  color,
  colorAmount,gift
}) => {
  const showTime = `${convertToPersian(time)} | ${ConvertJalali(date)}`;
  const isColorTrade = Boolean(color);
  return (
    <Container>
      <UserTime>
        <Time>{convertToPersian(index)}</Time>
        <User owner={owner}>
          <Div>
            {owner ? (
              <TitleBody title={getTranslation(1782)} />
            ) : (
              <>
                <HiOutlineUser size={20} />
                <TitleBody title={getTranslation(572)} />
              </>
            )}
          </Div>
          {owner ? (
            <TitleBody weight title={getTranslation(1947)} />
          ) : (
            <h4>
              <a target="_blank" rel="noreferrer" href={link}>
                {user}
              </a>
            </h4>
          )}
        </User>
      </UserTime>
      <TitleValue small title={getTranslation(564)} value={showTime} />
      {!isColorTrade && !owner && <Pricing type="rial" amount={rial} />}

      {!owner && !isColorTrade && <Pricing type="psc" amount={psc} />}

      {isColorTrade && (
        <Pricing
          type="color"
          amount={colorAmount}
          color={color}
          index={index}
          gift={gift}
        />
      )}
    </Container>
  );
};

export default HistoryItem;
