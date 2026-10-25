import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import { getTranslation } from "../../../../services/Utility";
import { useEffect, useState } from "react";

import CustomEditor from "../../../../components/Common/CustomEditor";
const Memory = () => {
  const { state, dispatch } = useGlobalState();
  const charLimit = 2000;

  const [memoryValue, setMemoryValue] = useState("");
  useEffect(() => {
    if (state.memory) {
      setMemoryValue(state.memory);
    }
  }, [state.memory]);

  const handleChange = (value) => {
    setMemoryValue(value);
    if (value.length <= charLimit && value !== state.memory) {
      dispatch({ type: "SET_MEMORY", payload: value });
    }
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <CustomEditor
        value={memoryValue}
        onChange={handleChange}
        img
        label={getTranslation("93")}
      />
    </div>
  );
};

export default Memory;
