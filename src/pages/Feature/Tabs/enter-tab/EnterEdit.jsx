import TitleHeader from "../../../../components/TitleHeader";
import { getTranslation } from "../../../../services/Utility";
import EditInputs from "./EditInputs";
import Container from "../../../../components/Common/Container";

const EnterEdit = ({ setEdit, data, setData, setPayed }) => (
  <Container>
    <TitleHeader title={getTranslation(537)} />
    <EditInputs
      data={data}
      setData={setData}
      setEdit={setEdit}
      setPayed={setPayed}
    />
  </Container>
);

export default EnterEdit;
