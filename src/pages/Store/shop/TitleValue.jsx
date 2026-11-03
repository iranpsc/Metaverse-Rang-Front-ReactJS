import styled from "styled-components";
import { convertToPersian } from "../../../services/Utility";
import TitleBody from "../../../components/TitleBody";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  @media (min-width: 1024px) {
    width: ${(props) => (props.shop ? "100px" : "")};
  }
`;

const TitleValue = ({ title, value, shop }) => {
  return (
    <Container shop={shop}>
      <TitleBody gray small title={title} />
      <TitleBody title={convertToPersian(value)} />
    </Container>
  );
};

export default TitleValue;
