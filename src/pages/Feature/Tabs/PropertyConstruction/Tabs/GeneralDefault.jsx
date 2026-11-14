import styled from "styled-components";
import InputsGeneralDefault from "./components/InputsGeneralDefault";
import ChoosingEnvironment from "./components/ChoosingEnvironment";
import Container from "../../../../../components/Common/Container";
const Wraper = styled(Container)`
  display: flex;
  width: 100%;
  gap: 40px;
  padding: 0 20px;
  margin-top: 15px;
  flex-direction: column;
  overflow-y: scroll;
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;
const GeneralDefault = () => {
  return (
    <Wraper>
      <InputsGeneralDefault />
      <ChoosingEnvironment />
    </Wraper>
  );
};

export default GeneralDefault;
