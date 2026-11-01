import {
  convertToPersian,
  getTranslation,
} from "../../../../services/Utility";
import CustomEditor from "../../../../components/Common/CustomEditor";
import { useLanguage } from "../../../../hooks/useLanguageContext.js";
import moment from "moment-jalaali";

const NextYear = ({ value, onChange }) => {
  const isPersian = useLanguage();
  const now = moment();

  const yearToDisplay = isPersian
    ? now.add(1, "jYear").format("jYYYY")
    : now.year() + 1;

  return (
    <div style={{ paddingTop: 20 }}>
      <CustomEditor
        label={getTranslation("656") + convertToPersian(yearToDisplay)}
        value={value}
        onChange={onChange}
        charLimit={10000}
        img
      />
    </div>
  );
};

export default NextYear;
