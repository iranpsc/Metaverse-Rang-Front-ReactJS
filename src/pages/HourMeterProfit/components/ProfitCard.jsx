import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import {
  convertToPersian,
  getTranslation,
  formatNumber,
  ConvertJalali,
} from "../../../services/Utility";

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

const Label = styled.h3`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const FeatureCode = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 600;
  color: #ffc700;
  cursor: pointer;
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
  font-size: 13px;
  font-weight: 500;
  color: #a0a0ab;

  span:last-child {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleClaim = (event) => {
    if (disabled) return;

    onClick?.(event.currentTarget.getBoundingClientRect());
  };

  const openFeature = () =>
    navigate(`/feature/${feature_db_id}/info`, {
      state: { from: location.pathname },
    });

  return (
    <Card>
      <Content>
        <Info>
          <Image $background={background}>
            <img src={logo} alt="" />
          </Image>

          <div>
            <Label>{title}</Label>
            <FeatureCode type="button" onClick={openFeature}>
              {feature_id?.toUpperCase()}
            </FeatureCode>
          </div>
        </Info>

        <Value
          type="button"
          $color={color}
          $background={background}
          disabled={disabled}
          onClick={handleClaim}
        >
          <span>{convertToPersian(formatNumber(amount, 3))}</span>
        </Value>
      </Content>

      <Footer>
        <span>{getTranslation("1827")} :</span>
        <span>{ConvertJalali(dead_line)}</span>
      </Footer>
    </Card>
  );
};

export default ProfitCard;
