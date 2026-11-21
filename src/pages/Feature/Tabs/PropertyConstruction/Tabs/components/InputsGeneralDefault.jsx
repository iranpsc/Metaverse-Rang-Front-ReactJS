// Controlled general-info form (activity, name, address, postal code, website, description); used in the feature build step

import styled from "styled-components";
import IsicSelect from "../../../../../../components/IsicCode/IsicSelect.jsx";
import LabeledInput from "../../../../../../components/LabeledInput.jsx";
import { getTranslation } from "../../../../../../services/Utility";
import TitleBody from "../../../../../../components/TitleBody.jsx";
const POSTAL_CODE_LENGTH = 10;

const parseActivities = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 17px;
  width: 100%;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns || "1fr 1fr"};
  align-items: start;
  gap: 10px;
  width: 100%;

  & > * {
    min-width: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InputsGeneralDefault = ({ inputs, updateField,isNameValid  }) => {
  const handleChange = (field) => (e) => updateField(field, e.target.value);

  return (
    <Container>
      <Row $columns="2fr 1fr">
        <IsicSelect
          value={parseActivities(inputs.activity_line)}
          onChange={(activities) =>
            updateField("activity_line", activities.join(","))
          }
        />
<LabeledInput
  value={inputs.name}
  onChange={handleChange("name")}
  placeholder={getTranslation("361")}
  error={!isNameValid}
/>
      </Row>

      <LabeledInput
        value={inputs.address}
        onChange={handleChange("address")}
        placeholder={getTranslation("362")}
        maxLength={100}
      />

      <Row>
        <LabeledInput
          type="number"
          value={inputs.postal_code}
          onChange={handleChange("postal_code")}
          placeholder={getTranslation("363")}
          maxLength={POSTAL_CODE_LENGTH}
        />
        <LabeledInput
          value={inputs.website}
          onChange={handleChange("website")}
          placeholder={getTranslation("364")}
          maxLength={100}
        />
      </Row>

      <LabeledInput
        value={inputs.description}
        placeholder={getTranslation("365")}
        onChange={handleChange("description")}
      />
      <TitleBody title={getTranslation(366)} />
    </Container>
  );
};

export default InputsGeneralDefault;
