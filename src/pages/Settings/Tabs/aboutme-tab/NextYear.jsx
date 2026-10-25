import { convertToPersian } from "../../../../services/Utility";
import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import { getTranslation } from "../../../../services/Utility";
import CustomEditor from "../../../../components/Common/CustomEditor";
import { useState, useEffect } from "react";
import { useLanguage } from "../../../../hooks/useLanguageContext.js";
import moment from "moment-jalaali";

const NextYear = () => {
  const [nextGeorgianYear, setNextGeorgianYear] = useState(null);
  const [nextJalaliYear, setNextJalaliYear] = useState(null);
  const { state, dispatch } = useGlobalState();
  const [predictionValue, setPredictionValue] = useState("");

  const charLimit = 10000;
  const isPersian = useLanguage();

  useEffect(() => {
    if (state.prediction) {
      setPredictionValue(state.prediction);
    }

    const now = moment();
    setNextGeorgianYear(now.year() + 1);
    setNextJalaliYear(moment().add(1, "jYear").format("jYYYY"));
  }, [state.prediction, isPersian]);

  const handleChange = (value) => {
    setPredictionValue(value);
    if (value.length <= charLimit) {
      dispatch({ type: "SET_PREDICTION", payload: value });
    }
  };

  const yearToDisplay = isPersian ? nextJalaliYear : nextGeorgianYear;

  return (
    <div style={{ paddingTop: 20 }}>
      <CustomEditor
        label={
          getTranslation("656") + convertToPersian(yearToDisplay)
        }
        value={predictionValue}
        onChange={handleChange}
        charLimit={10000}
        img
      />
    </div>
  );
};

export default NextYear;
