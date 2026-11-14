import styled from "styled-components";
import { useState } from "react";
import Dropdown from "../../../../components/Common/Dropdown";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: flex-start;
  gap: 10px;
`;

const EditLevelInput = ({ options = [], levels = [] }) => {
  const [selectedOption, setSelectedOption] = useState(options[5] ?? null);
  const [selectedLevel, setSelectedLevel] = useState(levels[2] ?? null);

  return (
    <Wrapper>
      <Dropdown
        options={options}
        selected={selectedOption}
        onSelect={setSelectedOption}
      />
      <Dropdown
        options={levels}
        selected={selectedLevel}
        onSelect={setSelectedLevel}
      />
    </Wrapper>
  );
};

export default EditLevelInput;
