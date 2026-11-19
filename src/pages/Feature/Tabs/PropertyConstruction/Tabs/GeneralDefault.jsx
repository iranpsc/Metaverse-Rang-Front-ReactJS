// Build-step page: general info form, environment picker and submit button; used in the feature build flow

import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../../../../../components/Button";
import Container from "../../../../../components/Common/Container";
import { useSelectedEnvironment } from "../../../../../services/reducers/SelectedEnvironmentContext.jsx";
import { getTranslation, ToastError } from "../../../../../services/Utility";
import { FeatureContext } from "../../../Context/FeatureProvider";
import InputsGeneralDefault from "./components/InputsGeneralDefault";
import ChoosingEnvironment from "./components/ChoosingEnvironment";

const POSTAL_CODE_LENGTH = 10;

const INITIAL_INPUTS = {
  activity_line: "",
  name: "",
  address: "",
  postal_code: "",
  website: "",
  description: "",
};

// دسکتاپ: اینپوت‌ها و دکمه راست، محیط‌ها چپ | موبایل: اینپوت‌ها، محیط‌ها، دکمه
const Wrapper = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "inputs environments"
    "submit environments";
  align-items: start;
  gap: 17px 40px;
  width: 100%;
  padding: 0 20px;
  margin-top: 15px;
  overflow-y: scroll;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "inputs"
      "environments"
      "submit";
    padding-bottom: 50px;
  }
`;

const Area = styled.div`
  grid-area: ${({ $area }) => $area};
  min-width: 0;
`;

const GeneralDefault = () => {
  const { updateFormState, toggleConfirmation, isSelectable } =
    useSelectedEnvironment() || {};
  const [feature] = useContext(FeatureContext) || [{}];
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const isNameValid = inputs.name.trim().length >= 4;

  const updateField = (field, value) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
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
    <Wrapper>
      <Area $area="inputs">
<InputsGeneralDefault
  inputs={inputs}
  updateField={updateField}
  isNameValid={isNameValid}
/>      </Area>

      <Area $area="environments">
        <ChoosingEnvironment />
      </Area>

      <Area $area="submit">
        <Button
          label={getTranslation("367")}
          onClick={handleSubmit}
          disabled={!isNameValid}
        />
      </Area>
    </Wrapper>
  );
};

export default GeneralDefault;