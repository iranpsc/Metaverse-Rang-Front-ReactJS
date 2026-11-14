import { useContext } from "react";
import { useLocation } from "react-router";
import Alert from "../../../../components/Alert/Alert.jsx";
import { UserContext } from "../../../../services/reducers/UserContext.jsx";
import { getTranslation } from "../../../../services/Utility/index.jsx";

const ESTABLISH_PATH = "/profile/dynasty/establish";
const KYC_PATH = "/verification/identity";

const getAlertConfig = (hasDynasty, isVerified, pathname) => {
  if (!hasDynasty) {
    return {
      text: getTranslation("1930"),
      buttonText: getTranslation("807"),
      to: ESTABLISH_PATH,
    };
  }

  if (!isVerified) {
    return {
      text: getTranslation("881"),
      buttonText: getTranslation("237"),
      to: KYC_PATH,
      state: { from: pathname },
    };
  }

  return null;
};

const DynastyAccessGuard = ({
  hasDynasty,
  loading = false,
  error = null,
  children,
}) => {
  const [user] = useContext(UserContext);
  const { pathname } = useLocation();

  if (loading) return children ?? null;

  if (error) {
    return <div>{error}</div>;
  }

  const alert = getAlertConfig(
    hasDynasty,
    Boolean(user?.verified_kyc),
    pathname,
  );

  return (
    <>
      {alert && <Alert blocking type="warning" {...alert} />}
      {children}
    </>
  );
};

export default DynastyAccessGuard;
