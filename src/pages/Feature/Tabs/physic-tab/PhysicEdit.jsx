import TitleHeader from "../../../../components/TitleHeader";
import { getTranslation } from "../../../../services/Utility";
import EditInputs from "./EditInputs";
import Container from "../../../../components/Common/Container";

const PhysicEdit = ({ setEdit, inputs, hasData, featureID, buildingID }) => (
  <Container>
    <TitleHeader title={hasData ? getTranslation(537) : getTranslation(356)} />
    <EditInputs
      hasData={hasData}
      inputs={inputs}
      setEdit={setEdit}
      featureID={featureID}
      buildingID={buildingID}
    />
  </Container>
);

export default PhysicEdit;
