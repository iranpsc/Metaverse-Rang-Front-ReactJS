import Info from "./Info";
import styled from "styled-components";
import Slider from "./Slider";
const Container = styled.div`
  width: 100%;
  min-width: 0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  height: 270px;

  @media (min-width: 1280px) {
    height: 600px;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, minmax(0, 1fr));
  }
`;

const Bio = () => {
  return (
    <Container>
      <Slider />
      <Info />
    </Container>
  );
};

export default Bio;
