import React, {
  useState,
  useRef,
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Map from "react-map-gl/maplibre";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css"
import { useNavigate } from "react-router";
import { Container } from "./styles";
import MapPolygons from "./MapPolygons";
import MapFlag from "./MapFlag";
import Mark from "./3dModelMap/Mark";
import { useSelectedEnvironment } from "../../services/reducers/SelectedEnvironmentContext";
import { useLanguage } from "../../services/reducers/LanguageContext";
import * as turf from "@turf/turf";
import AuthMiddleware from "../../middleware/AuthMiddleware";
import ZoomControls from "../../components/ZoomControls";
import FullscreenControls from "../../components/FullscreenControls";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext";
import { useTheme } from "../../services/reducers/ThemeContext";
import styleMapLight from "../../assets/styleMapLight.json";
import styleMapDark from "../../assets/styleMapDark.json";
import useMapUrlState, { showPolygons } from "../../services/Hooks/useMapUrlState";
import { flyToMapPosition } from "../../services/Utility/flyToMapPosition";
export const TransactionContext = createContext(null);
const MemoMapPolygons = React.memo(MapPolygons);
const MemoMapFlag = React.memo(MapFlag);
const MemoMark = React.memo(Mark);
setWorkerUrl("/assets/maplibre-gl-worker.mjs");
const MapTreeD = () => {
  const { setMapState, getMapState } = useMapUrlState();
  const [selectedTransaction, setSelectedTransaction] = useState([]);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const { updateFullScreenMap } = useScrollDirectionContext();
  const [isFullScreen, setFullScreen] = useState(false);
  const [isFullScreenMap, setFullScreenMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { confirmation, selectedEnvironment, hiddenModel } =
    useSelectedEnvironment();
  const isPersian = useLanguage();
  const navigate = useNavigate();
  const handleZoomChange = useCallback((delta) => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.zoomTo(map.getZoom() + delta, { duration: 200 });
  }, []);

  const handleZoomEnd = useCallback(() => { }, []);

  const handleFullscreenToggle = useCallback(() => {
    updateFullScreenMap(!isFullScreenMap);
    if (!mapContainerRef.current) return;
    if (!isFullScreenMap) {
      mapContainerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullScreenMap((prev) => !prev);
  }, [isFullScreenMap]);

  const toggleFullScreen = useCallback(() => {
    const docElement = document.documentElement;
    if (!isFullScreen) {
      docElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullScreen((prev) => !prev);
  }, [isFullScreen]);

  const handleMapClick = useCallback(
    (event) => {
      const feature = event.features?.[0];
      if (feature?.properties?.id) {
        navigate(`/feature/${feature.properties.id}`);
      }
      if (!mapRef.current || !feature?.geometry) return;

      const map = mapRef.current.getMap();
      const center = turf.center(feature.geometry);
      const currentZoom = map.getZoom();
      const MIN_ZOOM = 18;
      map.easeTo({
        center: center.geometry.coordinates,
        zoom: currentZoom < MIN_ZOOM ? MIN_ZOOM : currentZoom,
        duration: 800,
        easing: (t) => t,
      });
    },
    [navigate],
  );
  const { theme } = useTheme();

  useEffect(() => {
    if (isFullScreen && screen.orientation) {
      screen.orientation.lock("landscape-primary").catch(() => { });
    }
  }, [isFullScreen]);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attrib = document.querySelector(".maplibregl-ctrl-attrib");
      if (attrib?.classList.contains("maplibregl-compact-show")) {
        attrib.classList.remove("maplibregl-compact-show");
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const themeStyle = useMemo(
    () => (theme === "dark" ? styleMapDark : styleMapLight),
    [theme],
  );

 useEffect(() => {
  if (!mapLoaded) return;

  const map = mapRef.current?.getMap();
  if (!map) return;

  try {
    themeStyle.layers.forEach((layer) => {
      if (!layer.paint || !map.getLayer(layer.id)) return;

      Object.entries(layer.paint).forEach(([paintProperty, paintValue]) => {
        if (!paintProperty.toLowerCase().includes("color")) return;
        map.setPaintProperty(layer.id, paintProperty, paintValue);
      });
    });

    // آسمان هم با تم عوض شود
    if (themeStyle.sky) {
      map.setSky(themeStyle.sky);
    }
  } catch (e) {
    console.error(e);
  }
}, [mapLoaded, themeStyle]);

  const [initialStyle] = useState(() =>
    theme === "dark" ? styleMapDark : styleMapLight,
  );
  const handleMoveEnd = useCallback(() => {
    if (!initializedRef.current || !mapRef.current) return;

    const map = mapRef.current.getMap();
    const center = map.getCenter();

    setMapState({
      lat: center.lat,
      lng: center.lng,
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    });
  }, [setMapState]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || initializedRef.current) return;

    initializedRef.current = true;

    const state = getMapState();

    if (!state) return;

    flyToMapPosition({
      mapRef,
      latitude: Number(state.lat),
      longitude: Number(state.lng),
      zoom: Number(state.zoom),
      bearing: Number(state.bearing ?? 0),
      pitch: Number(state.pitch ?? 40),
      rotate: false,
      marker: false,
    });
  }, [mapLoaded, getMapState]);

  return (
    <AuthMiddleware>
      <TransactionContext.Provider
        value={{ selectedTransaction, setSelectedTransaction }}
      >
        <Container>
          <div
            ref={mapContainerRef}
            style={{ position: "relative", width: "100%", height: "100%" }}
          >
            <Map
              onMoveEnd={handleMoveEnd}
              ref={mapRef}
              className="map"
              canvasContextAttributes={{
                antialias: true,
              }}
              mapStyle={initialStyle}
              RTLTextPlugin="https://map.irpsc.com/rtl.js"
              interactiveLayerIds={["polygon-fill-layer"]}
              maxPitch={89}
              style={{ borderRadius: "10px" }}
              initialViewState={{
                latitude: 25.229,
                longitude: 54.2199,
                zoom: showPolygons,
                pitch: 40,
              }}
              onClick={handleMapClick}
              onZoomEnd={handleZoomEnd}
              onLoad={() => setMapLoaded(true)}
            >
              {confirmation && selectedEnvironment && !hiddenModel && (
                <MemoMark />
              )}

              <MemoMapPolygons />
              <MemoMapFlag />
            </Map>

            <ZoomControls
              isPersian={isPersian}
              onZoomChange={handleZoomChange}
            />
            <FullscreenControls
              isPersian={isPersian}
              onToggleFullScreen={toggleFullScreen}
              onToggleMapFullScreen={handleFullscreenToggle}
              isFullScreenMap={isFullScreenMap}
            />
          </div>
        </Container>
      </TransactionContext.Provider>
    </AuthMiddleware>
  );
};

export default React.memo(MapTreeD);
