import CustomEditor from "../../../components/Common/CustomEditor";
import { getTranslation } from "../../../services/Utility";

const Description = ({ state, setState }) => {
  const charLimit = 2000;

  const handleChange = (value) => {
    if (value.length <= charLimit) {
      setState((currentState) => ({
        ...currentState,
        description: value,
      }));
    }
  };

  return (
    <CustomEditor
      value={state.description}
      onChange={handleChange}
      label={getTranslation("1327")}
      img
    />
  );
};

export default Description;
