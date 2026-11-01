import CardPhotos from "./CardPhotos";
import InfoInputs from "./InfoInputs";
import TitleHeader from "../../../../components/TitleHeader";
import Alert from "../../../../components/Alert/Alert";
import { getTranslation } from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";

const IdentityInfo = ({ kyc = {}, showPending = false }) => (
  <Container>
    <Alert
      text={showPending ? getTranslation("1375") : getTranslation("885")}
      type={showPending ? "pending" : "success"}
    />

    <TitleHeader title={getTranslation("869")} />
    <InfoInputs kyc={kyc} />
    <CardPhotos nationalCardImg={kyc?.melli_card} />
  </Container>
);

export default IdentityInfo;
