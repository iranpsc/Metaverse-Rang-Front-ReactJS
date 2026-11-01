import { useMemo } from "react";
import moment from "moment-jalaali";
import CustomEditor from "../../../../components/Common/CustomEditor";
import { useLanguage } from "../../../../hooks/useLanguageContext.js";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import CurrentYears from "./CurrentYears";

const Prediction = ({ value, onChange }) => {
  const isPersian = useLanguage();

  const nextYear = useMemo(() => {
    const now = moment();
    return isPersian ? now.jYear() + 1 : now.year() + 1;
  }, [isPersian]);

  return (
    <>
      <CurrentYears />
      <CustomEditor
        label={`${getTranslation("656")} ${convertToPersian(nextYear)}`}
        value={value}
        onChange={onChange}
        charLimit={10000}
        img
      />
    </>
  );
};

export default Prediction;
