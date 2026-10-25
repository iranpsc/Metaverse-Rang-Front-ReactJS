import { createContext, useState } from "react";

export const MapContext = createContext();

export const MapContextProvider = ({ children }) => {
  const [flags, setFlags] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const addBuilding = (building) => {
    setBuildings((prev) => [...prev, building]);
  };

  const removeBuilding = (buildingId) => {
    setBuildings((prev) => prev.filter((b) => b.model_id !== buildingId));
  };

  return (
    <MapContext.Provider
      value={{
        flags,
        setFlags,
        polygons,
        setPolygons,
        buildings,
        setBuildings,
        addBuilding,
        removeBuilding,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
