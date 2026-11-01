import Bio from "./Bio";
import Buttons from "./Buttons";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  padding: 20px;
  display: grid;
  grid-template-columns: 10fr 0.8fr 1fr;
  hr {
    height: 90%;
    width: 2px;
    margin: 4px 2px 2px 2px;
    border: none;
    background-image: linear-gradient(to bottom, #dadada00, #b3b3b3, #dadada00);
  }
`;

const ResultCard = ({ user }) => {
  return (
    <Container>
      <Bio user={user} />
      <hr />
      <Buttons user={user} />
    </Container>
  );
};

export default ResultCard;
