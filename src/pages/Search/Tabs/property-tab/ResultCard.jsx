import Bio from "./Bio";
import Buttons from "./Buttons";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  padding: 20px;
  hr {
    height: 1.5px;
    width: 90%;
    margin: 4px auto;
    border: none;
    background-image: linear-gradient(to right, #dadada00, #b3b3b3, #dadada00);
  }
`;

const ResultCard = ({ item, system }) => {
  return (
    <Container>
      <Bio item={item} />
      <hr />
      <Buttons item={item} system={system} />
    </Container>
  );
};

export default ResultCard;
