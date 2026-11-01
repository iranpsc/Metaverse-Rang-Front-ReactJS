import styled from "styled-components";
import { convertToPersian, formatNumber } from "../../../services/Utility";

// رنگ دکمه => رنگ پس‌زمینه و سایه
const STYLES = {
  "#FF0000": {
    background: "#ff000021",
    shadow: "0px 10px 35px -10px #ff000066",
  },
  "#FFC700": {
    background: "#ffc80021",
    shadow: "0px 15px 30px -15px #FFC70080",
  },
  "#0066FF": {
    background: "#0066ff21",
    shadow: "0px 15px 30px -15px #0066FF80",
  },
};

const Container = styled.button`
  position: relative;
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-bottom: 2px solid ${({ $color }) => $color};
  border-radius: 10px;
  text-align: start;
  cursor: pointer;
  transform: rotateX(15deg);
  background-color: ${({ $color }) => STYLES[$color]?.background};
  box-shadow: ${({ $color }) => STYLES[$color]?.shadow};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Title = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 2px;
`;

const Amount = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const Button = ({ color, title, value, logo, disabled = false, onClick }) => {
  const handleClick = (event) => {
    if (disabled) return;

    onClick?.(event);
  };

  return (
    <Container
      type="button"
      $color={color}
      disabled={disabled}
      onClick={handleClick}
    >
      <Title>{title}</Title>

      <Row>
        <img width={24} height={24} src={logo} alt="" />
        <Amount $color={color}>{convertToPersian(formatNumber(value, 3))}</Amount>
      </Row>
    </Container>
  );
};

export default Button;