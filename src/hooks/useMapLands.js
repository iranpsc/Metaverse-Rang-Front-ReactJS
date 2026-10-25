import { useContext } from "react";
import { MapLandsContext } from "../services/reducers/MapLandsContext";

export const useMapLands = () => {
  const context = useContext(MapLandsContext);

  if (!context) {
    throw new Error("useMapLands must be used inside MapLandsProvider");
  }

  return context;
};
