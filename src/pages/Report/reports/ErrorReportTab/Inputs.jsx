import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility/index";
import Dropdown from "../../../../components/Common/Dropdown";
import LabeledInput from "../../../../components/LabeledInput";
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-top: 20px;
`;

const Inputs = ({ subject, title, onSubjectChange, onTitleChange }) => {
  const options = [
    { id: 1, label: getTranslation("1385"), value: "displayError" },
    { id: 2, label: getTranslation("15"), value: "spellingError" },
    { id: 3, label: getTranslation("16"), value: "codingError" },
    { id: 4, label: getTranslation("17"), value: "FPSError" },
    { id: 5, label: getTranslation("18"), value: "disrespect" },
  ];

  const subjectHandler = (e) => {
    onSubjectChange(e.target.value);
  };

  const titleHandler = (e) => {
    onTitleChange(e.target.value);
  };

  return (
    <Container>
      <Dropdown
        label={getTranslation("24")}
        options={options}
        selected={options.find((opt) => opt.value === subject)?.label || ""}
        onSelect={(val) => subjectHandler({ target: { value: val } })}
        placeholder={getTranslation("24")}
        searchable={false}
        selectPlaceHolder={false}
      />
      <LabeledInput
        label={getTranslation("19")}
        type="text"
        placeholder={getTranslation("19")}
        value={title}
        onChange={(e) => titleHandler(e)}
        maxLength={60}
      />
    </Container>
  );
};

export default Inputs;
