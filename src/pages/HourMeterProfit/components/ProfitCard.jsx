import styled from "styled-components";
import {
  convertToPersian,
  getTranslation,
  formatNumber,
  ConvertJalali,
} from "../../../services/Utility";
import TitleBody from "../../../components/TitleBody";
import LandText from "../../../components/LandText";
const Card = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #454545;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background-color: ${({ $background }) => $background};
`;


const Value = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 122px;
  height: 50px;
  border: none;
  border-bottom: 2px solid ${({ $color }) => $color};
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transform: rotateX(15deg);
  color: ${({ $color }) => $color};
  background-color: ${({ $background }) => $background};
  box-shadow: 0px 15px 30px -20px ${({ $color }) => $color};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 5px;
  padding-top: 7px;
  font-weight: 500;
  color: #a0a0ab;
  align-items: center;
`;

const ProfitCard = ({
  background,
  logo,
  title,
  feature_id,
  feature_db_id,
  color,
  amount,
  dead_line,
  onClick,
  disabled = false,
}) => {

  const handleClaim = (event) => {
    if (disabled) return;

    onClick?.(event.currentTarget.getBoundingClientRect());
  };

  return (
    <Card>
      <Content>
        <Info>
          <Image $background={background}>
            <img src={logo} alt="" />
          </Image>

          <div>
            <TitleBody title={title} />
            <LandText
              label={feature_id}
              to={`/feature/${feature_db_id}/info`}
            />
          </div>
        </Info>

        <Value
          type="button"
          $color={color}
          $background={background}
          disabled={disabled}
          onClick={handleClaim}
        >
          <TitleBody
            color="#ffc700"
            title={convertToPersian(formatNumber(amount, 3))}
          />
        </Value>
      </Content>

      <Footer>
        <TitleBody small title={getTranslation("1827")} />:
        <TitleBody small title={ConvertJalali(dead_line)} />
      </Footer>
    </Card>
  );
};

export default ProfitCard;
