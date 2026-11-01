import styled from "styled-components";
import Bio from "./Bio";
import Buttons from "./Buttons";

const Container = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
`;

const Divider = styled.hr`
  width: 90%;
  height: 1.5px;
  margin: 4px auto;
  border: none;
  background-image: linear-gradient(to right, #dadada00, #b3b3b3, #dadada00);
`;

const ResultCard = ({ item, system }) => (
  <Container>
    <Bio item={item} />
    <Divider />
    <Buttons item={item} system={system} />
  </Container>
);

export default ResultCard;
