import TitleHeader from "../../../../components/TitleHeader";
import EditInputs from "./EditInputs";

import styled from "styled-components";

const Container = styled.div`
  padding-top: 20px 0;
  padding-right: 15px;
  overflow-y: auto;
`;
const EnterEdit = ({ setEdit, data, setData, setPayed }) => {
  return (
    <Container>
      <TitleHeader title="entering-the-property" />
      <EditInputs
        data={data}
        setData={setData}
        setEdit={setEdit}
        setPayed={setPayed}
      />
    </Container>
  );
};

export default EnterEdit;
