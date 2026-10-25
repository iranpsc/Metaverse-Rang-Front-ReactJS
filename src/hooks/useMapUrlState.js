import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { isMobile } from "../services/Utility";
export const showPolygons = isMobile ? 12.75 : 14;
const DEFAULT_MAP_STATE = {
  lat: 25.229,
  lng: 54.2199,
  zoom: showPolygons,
  bearing: 0,
  pitch: 40,
};

export default function useMapUrlState() {
  const navigate = useNavigate();
  const location = useLocation();

  const setMapState = useCallback(
    ({ lat, lng, zoom, bearing = 0, pitch = 40 }) => {
      const params = new URLSearchParams(location.search);

      if (lat == null || lng == null) {
        params.delete("map");
      } else {
        params.set(
          "map",
          [
            Number(lat).toFixed(6),
            Number(lng).toFixed(6),
            Number(zoom).toFixed(2),
            Number(bearing).toFixed(1),
            Number(pitch).toFixed(1),
          ].join(","),
        );
      }

      navigate(
        {
          pathname: location.pathname,
          search: params.toString().replace(/%2C/g, ","),
        },
        {
          replace: true,
          state: location.state,
        },
      );
    },
    [location.pathname, location.search, navigate],
  );

  const getMapState = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const map = params.get("map");

    if (!map) {
      return location.pathname === "/" ? DEFAULT_MAP_STATE : null;
    }

    const [
      lat,
      lng,
      zoom,
      bearing = DEFAULT_MAP_STATE.bearing,
      pitch = DEFAULT_MAP_STATE.pitch,
    ] = map.split(",").map(Number);

    if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(zoom)) {
      return location.pathname === "/" ? DEFAULT_MAP_STATE : null;
    }

    return {
      lat,
      lng,
      zoom,
      bearing,
      pitch,
    };
  }, [location.pathname, location.search]);

  return {
    getMapState,
    setMapState,
  };
}
