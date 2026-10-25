import { createContext, useEffect, useState } from "react";
import useRequest from "../../../hooks/useRequest.js";

export const FeatureContext = createContext({});

export default function FeatureProvider({ children, id }) {
  const [feature, setFeature] = useState({});
  const { Request, HTTP_METHOD } = useRequest();

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const featureRes = await Request(`features/${id}`);
        const featureData = featureRes.data.data;

        const buildingsRes = await Request(
          `features/${id}/build/buildings`,
          HTTP_METHOD.GET,
        );

        setFeature({
          ...featureData,
          buildings: buildingsRes.data.data,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeature();
  }, [id]);

  return (
    <FeatureContext.Provider value={[feature, setFeature]}>
      {children}
    </FeatureContext.Provider>
  );
}
