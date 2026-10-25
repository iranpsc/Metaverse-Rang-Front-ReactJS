import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import { getTranslation } from "../../../../services/Utility";
import { useEffect, useState } from "react";
import CustomEditor from "../../../../components/Common/CustomEditor";

const Opportunity = () => {
  const { state, dispatch } = useGlobalState();
  const [opportunityValue, setOpportunityValue] = useState("");
  useEffect(() => {
    if (state.opportunity) {
      setOpportunityValue(state.opportunity);
    }
  }, [state.opportunity]);

  const handleChange = (value) => {
    setOpportunityValue(value);
    const charLimit = 2000;

    if (value.length <= charLimit) {
      dispatch({ type: "SET_OPPORTUNITY", payload: value });
    }
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <CustomEditor
        value={opportunityValue}
        onChange={handleChange}
        label={getTranslation("801")}
      />
    </div>
  );
};

export default Opportunity;
