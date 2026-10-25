import { useContext } from "react";
import { MapContext } from "../services/reducers/mapContext";

export const useMapData = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapData must be used within a MapContextProvider");
  }
  return context;
};
