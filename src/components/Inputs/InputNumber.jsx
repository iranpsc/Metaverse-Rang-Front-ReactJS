import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  background-color: ${(props) =>
    props.error ? props.theme.inputBgColorError : props.theme.inputBgColor};
  border: 1px solid
    ${(props) =>
      props.error ? props.theme.inputBorderError : props.theme.inputBorder};
  outline: none;
  border-radius: 5px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${(props) =>
    props.error ? props.theme.inputTextError : props.theme.inputText};
  ::placeholder {
    color: ${(props) => props.theme.colors.primary};
    font-size: 15px;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
  }
`;

const InputNumber = ({ placeholder, value, onChange, Error }) => {
  return (
    <StyledInput
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      step="any"
      min={0}
      error={Error}
    />
  );
};

export default InputNumber;
