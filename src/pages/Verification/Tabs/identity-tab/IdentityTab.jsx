import useRequest from "../../../../hooks/useRequest.js";
import IdentityInfo from "./IdentityInfo";
import IdentityInputs from "./IdentityInputs";
import { useState, useEffect } from "react";

const IdentityTab = () => {
  const [kyc, setKyc] = useState({});
  const { Request } = useRequest();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Request("kyc").then((response) => {
      const fetchedKyc = response?.data?.data || {};
      setKyc(fetchedKyc);

      if (fetchedKyc?.status === 1) {
        setSubmitted(true);
      } else if (fetchedKyc?.status === 0) {
        setSubmitted("pending");
      }
    });
  }, []);

  if (!submitted) {
    return (
      <IdentityInputs
        initialKyc={kyc}
        onSubmitSuccess={() => setSubmitted(true)}
      />
    );
  }

  if (submitted === "pending") {
    return <IdentityInfo kyc={kyc} showPending={true} />;
  }

  return <IdentityInfo kyc={kyc} />;
};

export default IdentityTab;
