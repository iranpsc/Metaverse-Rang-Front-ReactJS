import InfoInputs from "./InfoInputs";
import TitleHeader from "../../../../components/TitleHeader";
import Alert from "../../../../components/Alert/Alert";
import { getTranslation } from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";
import TitleBody from "../../../../components/TitleBody";
import FileUploader from "../../../../components/FileUploader/FileUploader";

const IdentityInfo = ({ kyc = {}, showPending = false }) => (
  <Container>
    <Alert
      text={showPending ? getTranslation("1375") : getTranslation("885")}
      type={showPending ? "pending" : "success"}
    />

    <TitleHeader title={getTranslation("869")} />
    <InfoInputs kyc={kyc} />
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      {" "}
      <TitleBody title={getTranslation("878")} />
      <FileUploader mode="display" file={kyc?.melli_card} />
    </div>
  </Container>
);

export default IdentityInfo;
