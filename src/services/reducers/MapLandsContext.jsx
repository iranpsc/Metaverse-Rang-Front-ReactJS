import { createContext, useState } from "react";

export const MapLandsContext = createContext(null);

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
