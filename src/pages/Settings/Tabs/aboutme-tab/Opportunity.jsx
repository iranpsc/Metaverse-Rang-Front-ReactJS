import { getTranslation } from "../../../../services/Utility";
import CustomEditor from "../../../../components/Common/CustomEditor";

const Opportunity = ({ value, onChange }) => {
  return (
    <div style={{ paddingTop: 20 }}>
      <CustomEditor
        value={value}
        onChange={onChange}
        charLimit={2000}
        label={getTranslation("801")}
      />
    </div>
  );
};

export default Opportunity;
