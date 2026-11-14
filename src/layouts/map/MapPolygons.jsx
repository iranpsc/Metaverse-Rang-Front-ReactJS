import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl/maplibre";
import { useLoader } from "@react-three/fiber";
import { Canvas, NearCoordinates } from "react-three-map/maplibre";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils";
import { BORDER_COLORS } from "../../services/constants/BorderColors";
import { POLYGON_COLORS } from "../../services/constants/PolygonColors";
import useRequest from "../../hooks/useRequest";
import { useMapData } from "../../services/reducers/mapContext";
import { useSelectedEnvironment } from "../../services/reducers/SelectedEnvironmentContext";
import { useMapLands } from "../../services/reducers/MapLandsContext";
import { showPolygons } from "../../hooks/useMapUrlState";
import { onSocketEvent } from "../../services/socket";

const CANVAS_COORDS = {
  latitude: 30.233922946967866,
  longitude: 54.20761223027057,
};
const BEFORE_LAYER = "location-icon-layer";
const FILL_PAINT = { "fill-color": ["get", "fill"] };
const LINE_PAINT = { "line-color": ["get", "border"], "line-width": 1.5 };

const getBuildingKey = (model) =>
  `${model?.id}__${model?.building?.feature_id}`;

// Suitable for: rendering one FBX building model with adjustable opacity.
// Used in: MapPolygons (only), inside NearCoordinates.
const FBXModel = memo(({ url, rotation, opacity }) => {
  const fbx = useLoader(FBXLoader, url);

  // clone scene and materials once per model
  const scene = useMemo(() => {
    const cloned = cloneSkeleton(fbx);
    cloned.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material = Array.isArray(child.material)
        ? child.material.map((m) => m.clone())
        : child.material.clone();
    });
    return cloned;
  }, [fbx]);

  // opacity changes only touch material props, no re-cloning
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      [].concat(child.material).forEach((material) => {
        material.transparent = true;
        material.opacity = opacity;
        material.depthWrite = opacity === 1;
        material.needsUpdate = true;
      });
    });
  }, [scene, opacity]);

  return (
    <group rotation={rotation} scale={0.0097}>
      <hemisphereLight args={["#ffffff", "#60666C"]} intensity={12} />
      <primitive object={scene} />
    </group>
  );
});

// Suitable for: the map's land polygons layer + 3D buildings canvas.
// Used in: the main map page (child of the react-map-gl Map).
const MapPolygons = () => {
  const { buildings, setBuildings } = useMapData();
  const { selectedEnvironment } = useSelectedEnvironment();
  const { mapLands, setMapLands } = useMapLands();
  const map = useMap();
  const { Request } = useRequest();

  const [isPolygonSourceLoaded, setIsPolygonSourceLoaded] = useState(false);
  const [zoom, setZoom] = useState(map.current?.getZoom() || 0);

  const timeoutRef = useRef(null);
  const isRequestingRef = useRef(false);
  const lastBoundsRef = useRef(null);
  const requestIdRef = useRef(0);

  const isPolygonsZoom = zoom >= showPolygons;

  // live land color updates from socket
  useEffect(() => {
    return onSocketEvent("feature-status-changed", (payload) => {
      const eventData = payload?.data ?? payload;
      if (eventData?.id == null) return;

      setMapLands((prev) =>
        prev.map((feature) =>
          String(feature.id) === String(eventData.id)
            ? { ...feature, rgb: eventData.rgb }
            : feature,
        ),
      );
    });
  }, [setMapLands]);

  // zoom tracking
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    const handleZoomEnd = () => setZoom(mapInstance.getZoom());
    mapInstance.on("zoomend", handleZoomEnd);
    return () => mapInstance.off("zoomend", handleZoomEnd);
  }, [map]);

  // load features + buildings for the visible bounds
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    const loadFeatures = async () => {
      if (mapInstance.getZoom() < showPolygons || isRequestingRef.current)
        return;

      const bounds = mapInstance.getBounds();
      if (!bounds) return;

      const corners = [
        bounds.getSouthWest(),
        bounds.getSouthEast(),
        bounds.getNorthWest(),
        bounds.getNorthEast(),
      ];

      const boundsKey = corners
        .map((c) => `${c.lng.toFixed(4)},${c.lat.toFixed(4)}`)
        .join(",");
      if (lastBoundsRef.current === boundsKey) return;
      lastBoundsRef.current = boundsKey;

      const requestId = ++requestIdRef.current;
      isRequestingRef.current = true;

      try {
        const url =
          "features?" +
          corners.map((c) => `points[]=${c.lng},${c.lat}`).join("&") +
          "&load_buildings=1";

        const response = await Request(url);
        if (requestId !== requestIdRef.current) return;

        const data = response?.data?.data;
        if (!Array.isArray(data) || data.length === 0) return;

        const newFeatures = data
          .map((feature) => ({
            id: feature?.geometry?.feature_id,
            rgb: feature?.properties?.rgb,
            coordinates:
              feature?.geometry?.coordinates?.map((c) => [
                parseFloat(c.x),
                parseFloat(c.y),
              ]) || [],
          }))
          .filter((feature) => feature.id != null);

        const newBuildings = data.flatMap((feature) =>
          (feature?.building_models || []).map((model) => ({
            ...model,
            uniqueKey: getBuildingKey(model),
          })),
        );

        setMapLands((prev) => {
          const existing = new Set(prev.map((f) => String(f.id)));
          const unique = newFeatures.filter((f) => !existing.has(String(f.id)));
          return unique.length ? [...prev, ...unique] : prev;
        });

        setBuildings((prev) => {
          const existing = new Set(prev.map(getBuildingKey));
          const unique = newBuildings.filter((model) => {
            if (model?.id == null || model?.building?.feature_id == null)
              return false;
            const key = getBuildingKey(model);
            if (existing.has(key)) return false;
            existing.add(key);
            return true;
          });
          return unique.length ? [...prev, ...unique] : prev;
        });
      } catch (error) {
        console.error("Error loading map features:", error);
        lastBoundsRef.current = null;
      } finally {
        isRequestingRef.current = false;
      }
    };

    const handleMoveEnd = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(loadFeatures, 600);
    };

    mapInstance.on("moveend", handleMoveEnd);
    loadFeatures();
    timeoutRef.current = setTimeout(loadFeatures, 300);

    return () => {
      mapInstance.off("moveend", handleMoveEnd);
      clearTimeout(timeoutRef.current);
    };
  }, [map, Request, setMapLands, setBuildings]);

  // wait until the polygons source is loaded
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !isPolygonsZoom) {
      setIsPolygonSourceLoaded(false);
      return;
    }

    const handleSourceData = (event) => {
      if (event.sourceId === "polygons" && event.isSourceLoaded) {
        setIsPolygonSourceLoaded(true);
      }
    };

    if (mapInstance.style?.sourceCaches?.polygons?.loaded()) {
      setIsPolygonSourceLoaded(true);
    }

    mapInstance.on("sourcedata", handleSourceData);
    return () => mapInstance.off("sourcedata", handleSourceData);
  }, [isPolygonsZoom, map]);

  const polygonsGeoJson = useMemo(
    () => ({
      type: "FeatureCollection",
      features: mapLands.map((polygon) => ({
        type: "Feature",
        properties: {
          id: polygon.id,
          fill: POLYGON_COLORS[polygon.rgb],
          border: BORDER_COLORS[polygon.rgb],
        },
        geometry: { type: "Polygon", coordinates: [polygon.coordinates] },
      })),
    }),
    [mapLands],
  );

  // parse position/opacity only when buildings change, not on every render
  const buildingItems = useMemo(() => {
    const now = new Date();
    return buildings.map((model) => {
      const [latitude, longitude] = model?.building?.position
        ?.split(",")
        .map(Number);

      return {
        key: model.uniqueKey,
        url: model.file.url,
        latitude,
        longitude,
        rotation: [0, model?.building?.rotation ?? 0, 0],
        opacity:
          now < new Date(model?.building?.construction_end_date) ? 0.3 : 1,
      };
    });
  }, [buildings]);

  const beforeId = map.current?.getLayer(BEFORE_LAYER)
    ? BEFORE_LAYER
    : undefined;

  return (
    <>
      {isPolygonsZoom && (
        <Source id="polygons" type="geojson" data={polygonsGeoJson}>
          <Layer
            id="polygon-fill-layer"
            type="fill"
            beforeId={beforeId}
            paint={FILL_PAINT}
          />
          <Layer
            id="polygon-outline-layer"
            type="line"
            beforeId={beforeId}
            paint={LINE_PAINT}
          />
        </Source>
      )}

      {isPolygonsZoom && isPolygonSourceLoaded && buildingItems.length > 0 && (
        <Canvas {...CANVAS_COORDS} key={selectedEnvironment?.id ?? "no-env"}>
          {buildingItems.map((item) => (
            <NearCoordinates
              key={item.key}
              latitude={item.latitude}
              longitude={item.longitude}
            >
              <FBXModel
                url={item.url}
                rotation={item.rotation}
                opacity={item.opacity}
              />
            </NearCoordinates>
          ))}
        </Canvas>
      )}
    </>
  );
};

export default MapPolygons;
