import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import { getTranslation } from "../../../../services/Utility";
import { useEffect, useState } from "react";
import CustomEditor from "../../../../components/Common/CustomEditor";
const About = () => {
  const { state, dispatch } = useGlobalState();
  const charLimit = 10000;
  const [aboutValue, setAboutValue] = useState("");

  useEffect(() => {
    if (state.about) {
      setAboutValue(state.about);
    }
  }, [state.about]);

  const handleChange = (value) => {
    setAboutValue(value);
    if (value.length <= charLimit) {
      dispatch({ type: "SET_ABOUT", payload: value });
    }
  };

  return (
    <CustomEditor
      value={aboutValue}
      onChange={handleChange}
      img
      label={getTranslation("781")}
    />
  );
};

export default About;
