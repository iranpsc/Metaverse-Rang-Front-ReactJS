import styled from "styled-components";
import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import {
  getTranslation,
  getFieldsByTabName,
} from "../../../../services/Utility";
import Dropdown from "../../../../components/Common/Dropdown";
const Container = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
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

const Label = styled.label`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 5px;
  border: 1px solid #454545;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  color: ${(props) => props.theme.colors.newColors.shades.title};
  padding: 10px 12px;
  outline: none;
  font-size: 16px;
`;
const EducationsAndJob = () => {
  const { state, dispatch } = useGlobalState();

  const educationFields = getFieldsByTabName(1301, 1307);

  const handleEducationChange = (uniqueId) => {
    dispatch({
      type: "SET_EDUCATION",
      payload: String(uniqueId),
    });
  };

  const handleJobChange = (e) => {
    dispatch({
      type: "SET_OCCUPATION",
      payload: e.target.value,
    });
  };


  return (
    <Container>
      <div>
        <Label htmlFor="education">
          {getTranslation("1465")}
        </Label>

        <Dropdown
          options={educationFields.map((field) => ({
            id: field.unique_id,
            value: String(field.unique_id),
            label: field.translation,
          }))}
          selected={state.education}
          onSelect={(uniqueId) => {
            handleEducationChange(uniqueId);
          }}
          placeholder={getTranslation("1465")}
        />
      </div>

      <div>
        <Label htmlFor="job">
          {getTranslation("86")}
        </Label>

        <Input
          id="job"
          value={state.occupation || ""}
          onChange={handleJobChange}
          placeholder={getTranslation("783")}
          maxLength={25}
        />
      </div>
    </Container>
  );
};

export default EducationsAndJob;