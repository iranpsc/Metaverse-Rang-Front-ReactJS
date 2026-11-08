import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../../../../../../components/Button";
import IsicSelect from "../../../../../../components/IsicCode/IsicSelect.jsx";
import LabeledInput from "../../../../../../components/LabeledInput.jsx";
import { useSelectedEnvironment } from "../../../../../../services/reducers/SelectedEnvironmentContext.jsx";
import { getTranslation, ToastError } from "../../../../../../services/Utility";
import { FeatureContext } from "../../../../Context/FeatureProvider";
const POSTAL_CODE_LENGTH = 10;

const INITIAL_INPUTS = {
  activity_line: "",
  name: "",
  address: "",
  postal_code: "",
  website: "",
  description: "",
};

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

// ستون‌ها از بیرون تعیین میشن؛ پیش‌فرض دو ستون مساوی
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

const Note = styled.p`
  color: ${({ theme }) => theme.colors.newColors.otherColors.text};
  font-size: 16px;
  font-weight: 400;
`;

const InputsGeneralDefault = () => {
  const { updateFormState, toggleConfirmation, isSelectable } =
    useSelectedEnvironment() || {};
  const [feature] = useContext(FeatureContext) || [{}];
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const isNameValid = inputs.name.trim().length >= 4;

  const updateField = (field, value) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  const handleChange = (field) => (e) => updateField(field, e.target.value);

  const handleButtonClick = () => {
    if (!isNameValid) return;

    if (inputs.postal_code && inputs.postal_code.length < POSTAL_CODE_LENGTH) {
      ToastError(getTranslation("1602"));
      return;
    }

    if (!isSelectable) {
      ToastError(getTranslation("1611"));
      return;
    }

    updateFormState?.({ ...inputs, featureId: feature?.id ?? "" });
    toggleConfirmation?.();
    navigate("/", { replace: true });
  };
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

      <Note>{getTranslation("366")}</Note>

      <Button
        label={getTranslation("367")}
        onClick={handleButtonClick}
        disabled={!isNameValid}
      />
    </Container>
  );
};

export default InputsGeneralDefault;
