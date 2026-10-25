import { createContext, useEffect, useState } from "react";
import useRequest from "../../../hooks/useRequest.js";

export const KycContext = createContext({});

export default function KycProvider({ children }) {
  const [kyc, setKyc] = useState({});
  const { Request } = useRequest();

  useEffect(() => {
    Request(`kyc`).then((response) => {
      setKyc(response.data.data);
    });

  }, []);

  return (
    <KycContext.Provider value={[kyc, setKyc]}>
      { children }
    </KycContext.Provider>
  );
}
