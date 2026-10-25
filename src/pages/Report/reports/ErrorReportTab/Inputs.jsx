import styled from "styled-components";
import { useReportsGlobalState } from "../../../../hooks/useReportsGlobalState";
import { getTranslation } from "../../../../services/Utility/index";
import Dropdown from "../../../../components/Common/Dropdown";
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-top: 20px;
`;

const Subject = styled.div`
  select {
    background-color: ${(props) =>
      props.theme.colors.newColors.otherColors.inputBg};
    border: 1px solid #454545;
    border-radius: 5px;
    padding: 10px 12px;
    outline: none;
    color: #84858f;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
  }
`;

const Label = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
`;

const Title = styled.div`
  input {
    background-color: ${(props) =>
      props.theme.colors.newColors.otherColors.inputBg};
    border: 1px solid #454545;
    border-radius: 5px;
    padding: 10px 12px;
    outline: none;
    color: #84858f;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    
  }
`;

const Inputs = () => {
  const options = [
    { id: 1, label: getTranslation("1385"), value: "displayError" },
    { id: 2, label: getTranslation("15"), value: "spellingError" },
    { id: 3, label: getTranslation("16"), value: "codingError" },
    { id: 4, label: getTranslation("17"), value: "FPSError" },
    { id: 5, label: getTranslation("18"), value: "disrespect" },
  ];

  const { state, dispatch } = useReportsGlobalState();

  const subjectHandler = (e) => {
    const value = e.target.value;
    dispatch({ type: "SET_SUBJECT", payload: value });
  };

  const titleHandler = (e) => {
    const value = e.target.value;
    dispatch({ type: "SET_TITLE", payload: value });
  };

  return (
    <Container>
      <Subject>
        <Label>{getTranslation("24")}</Label>
        <Dropdown
          options={options}
          selected={
            options.find((opt) => opt.value === state.subject)?.label || ""
          } 
          onSelect={(val) => subjectHandler({ target: { value: val } })}
          placeholder={getTranslation("24")}
          searchable={false}
          selectPlaceHolder={false}
        />
      </Subject>
      <Title>
        <Label>{getTranslation("19")}</Label>
        <input
          type="text"
          placeholder={getTranslation("19")}
          value={state.title}
          onChange={(e) => titleHandler(e)}
          maxLength={130} // محدودیت 200 کاراکتر
        />
      </Title>
    </Container>
  );
};

export default Inputs;
