import { createContext, useContext, useState } from "react";

export const MapContext = createContext();

export const useMapData = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapData must be used within a MapContextProvider");
  }
  return context;
};

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
