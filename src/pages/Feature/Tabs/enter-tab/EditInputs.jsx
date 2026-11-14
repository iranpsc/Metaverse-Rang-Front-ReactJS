import { useState } from "react";
import Codes from "./Codes";
import EditLevelInput from "./EditLevelInput";
import styled from "styled-components";
import LabeledInput from "../../../../components/LabeledInput";
import TitleHeader from "../../../../components/TitleHeader";
import { getTranslation } from "../../../../services/Utility";
import Button from "../../../../components/Button";
const Container = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const First = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const Second = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 10px;
`;

const EditInputs = ({ data, setEdit }) => {
  const inputs = data[0].inputs;

  // مقدار هر فیلد با id خودش نگه داشته میشه
  const [values, setValues] = useState(() =>
    Object.fromEntries(inputs.map((input) => [input.id, input.value ?? ""])),
  );

  const handleChange = (id) => (e) =>
    setValues((prev) => ({ ...prev, [id]: e.target.value }));
  const renderInput = (input) => (
    <LabeledInput
      key={input.id}
      placeholder={input.placeholder}
      type={input.type}
      suffix={input.suffix}
      value={values[input.id]}
      onChange={handleChange(input.id)}
    />
  );

  return (
    <Container>
      <First>{inputs.slice(0, 2).map(renderInput)}</First>

      <Second>
        {inputs.slice(3, 4).map((input) => (
          <EditLevelInput {...input} key={input.id} />
        ))}
        {inputs.slice(2, 3).map(renderInput)}
      </Second>
      <TitleHeader title={getTranslation(543)} />
      <Codes />

      <Button label={getTranslation(537)} onClick={() => setEdit(false)} />
    </Container>
  );
};

export default EditInputs;
