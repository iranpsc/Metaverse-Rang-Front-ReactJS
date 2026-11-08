import { createContext, useContext, useState } from "react";

export const MapLandsContext = createContext(null);

export const useMapLands = () => {
  const context = useContext(MapLandsContext);
  if (!context) {
    throw new Error("useMapLands must be used inside MapLandsProvider");
  }
  return context;
};

export const MapLandsProvider = ({ children }) => {
  const [mapLands, setMapLands] = useState([]);

  return (
    <MapLandsContext.Provider
      value={{
        mapLands,
        setMapLands,
      }}
    >
      {children}
    </MapLandsContext.Provider>
  );
};
