import styled from "styled-components";
import {
  getTranslation,
  getFieldsByTabName,
} from "../../../../services/Utility";
import Dropdown from "../../../../components/Common/Dropdown";
import LabeledInput from "../../../../components/LabeledInput";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
  padding-top: 20px;

  div {
    width: 100%;
  }

  @media (min-width: 1366px) {
    flex-direction: row;
    div {
      width: 100%;
    }
  }
`;

const EducationsAndJob = ({ education, occupation, onChange }) => {
  const educationFields = getFieldsByTabName(1301, 1307);

  const handleEducationChange = (uniqueId) => {
    onChange("education", String(uniqueId));
  };

  const handleJobChange = (e) => {
    onChange("occupation", e.target.value);
  };

  return (
    <Container>
      <div>
        <Dropdown
          label={getTranslation("1465")}
          options={educationFields.map((field) => ({
            id: field.unique_id,
            value: String(field.unique_id),
            label: field.translation,
          }))}
          selected={education}
          onSelect={(uniqueId) => {
            handleEducationChange(uniqueId);
          }}
          placeholder={getTranslation("1465")}
        />
      </div>

      <LabeledInput
        label={getTranslation("86")}
        value={occupation || ""}
        onChange={handleJobChange}
        placeholder={getTranslation("783")}
      />
    </Container>
  );
};

export default EducationsAndJob;
