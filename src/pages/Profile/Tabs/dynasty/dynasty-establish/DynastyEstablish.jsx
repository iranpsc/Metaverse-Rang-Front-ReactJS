import Establish from "./Establish";
import PropertySelect from "./PropertySelect";
import Container from "../../../../../components/Common/Container";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  gap: 20px;
  @media (max-width: 1280px) {
    flex-direction: column-reverse;
  }
`;
const DynastyEstablish = ({ data, setData, member }) => {
  return (
    <Container>
      <Wrapper>
        <PropertySelect data={data} setData={setData} />
        <Establish members={member} />
      </Wrapper>
    </Container>
  );
};

export default DynastyEstablish;
