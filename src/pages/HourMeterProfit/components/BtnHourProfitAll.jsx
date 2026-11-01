import styled from "styled-components";

const DEFAULT_COLOR = "black";

const Btn = styled.button`
  width: 33%;
  height: 40px;
  border: 1px solid ${({ $color }) => $color};
  border-radius: 12px;
  color: ${({ $color }) => $color};
  background-color: white;
  filter: drop-shadow(0 2px 2px ${({ $color }) => $color});
`;

const BtnHourProfitAll = ({ value, color = DEFAULT_COLOR, onClick }) => (
  <Btn type="button" $color={color} onClick={onClick}>
    {value}
  </Btn>
);

export default BtnHourProfitAll;
