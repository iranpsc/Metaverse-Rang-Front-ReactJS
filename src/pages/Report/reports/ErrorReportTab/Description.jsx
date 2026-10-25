import { useReportsGlobalState } from "../../../../hooks/useReportsGlobalState";
import { getTranslation } from "../../../../services/Utility/index";
import CustomEditor from "../../../../components/Common/CustomEditor";

const Description = () => {
  const { state, dispatch } = useReportsGlobalState();

  const handleChange = (value) => {
    dispatch({ type: "SET_DESCRIPTION", payload: value });
  };

  return (
    <CustomEditor
      value={state.description}
      onChange={handleChange}
      label={getTranslation("20")}
    />
  );
};

export default Description;
