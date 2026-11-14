import { useCallback, useMemo, memo, useState, useEffect } from "react";
import { useMap, Source, Layer } from "react-map-gl/maplibre";
import { useLoader } from "@react-three/fiber";
import { Canvas } from "react-three-map/maplibre";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { HemisphereLight } from "three";
import { useNavigate } from "react-router";
import { useSelectedEnvironment } from "../../../services/reducers/SelectedEnvironmentContext.jsx";
import { getTranslation, ToastError, ToastSuccess } from "../../../services/Utility";
import { flyToMapPosition } from "../../../services/Utility/flyToMapPosition.js";
import AngleControl from "../../../pages/Feature/Tabs/PropertyConstruction/Tabs/components/AngleControl.jsx";

import { ClipLoader } from "react-spinners";
import * as turf from "@turf/turf";

const calculateSquareCoordinates = (center, area) => {
  const R = 6378137; // Radius of the Earth in meters
  const sideLength = Math.sqrt(area);
  const halfSideLength = sideLength / 2;
  const deltaLat = (halfSideLength / R) * (180 / Math.PI);
  const deltaLng =
    (halfSideLength / (R * Math.cos((Math.PI * center.latitude) / 180))) *
    (180 / Math.PI);

  return [
    [center.longitude - deltaLng, center.latitude + deltaLat],
    [center.longitude + deltaLng, center.latitude + deltaLat],
    [center.longitude + deltaLng, center.latitude - deltaLat],
    [center.longitude - deltaLng, center.latitude - deltaLat],
    [center.longitude - deltaLng, center.latitude + deltaLat],
  ];
};

const FBXModel = memo(({ url, rotation, setLoading, onReady }) => {
  const fbx = useLoader(FBXLoader, url, (loader) => {
    loader.manager.onStart = () => setLoading(true);
    loader.manager.onLoad = () => setLoading(false);
    loader.manager.onError = () => setLoading(false);
  });

  useEffect(() => {
    onReady(true);
    return () => onReady(false);
  }, [onReady]);

  return (
    <group rotation={rotation} scale={0.0097}>
      <hemisphereLight
        args={["#ffffff", "#60666C"]}
        intensity={12}
        position={[1, 4.5, 3]}
      />
      <primitive object={fbx} />
    </group>
  );
});

const Mark = memo(() => {
  const { selectedEnvironment, formState, resetStates } =
    useSelectedEnvironment();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rotationX, setRotationX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [landReady, setLandReady] = useState(false);
  const showPolygon = true;
  const [modelReady, setModelReady] = useState(false);
  const map = useMap();
  const navigate = useNavigate();
  const center = map.current.getCenter();
  const desiredSlug = "area";
  const attributeObject = selectedEnvironment.attributes.find(
    (attribute) => attribute.slug === desiredSlug,
  );
  const size = parseFloat(attributeObject.value);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: center.lat,
    longitude: center.lng,
  });

  const polygonCoordinates = useMemo(
    () => calculateSquareCoordinates(markerPosition, size),
    [markerPosition, size],
  );

  const rotatedPolygonCoordinates = useMemo(() => {
    const polygon = turf.polygon([polygonCoordinates]);
    const rotatedPolygon = turf.transformRotate(polygon, 90 - rotationX, {
      pivot: [markerPosition.longitude, markerPosition.latitude],
    });
    return rotatedPolygon.geometry.coordinates[0];
  }, [polygonCoordinates, markerPosition, rotationX]);

  const environmentCoordinates = useMemo(
    () =>
      selectedEnvironment.coordinates.map((coord) => {
        const [longitude, latitude] = coord.split(",");
        return [parseFloat(longitude), parseFloat(latitude)];
      }),
    [selectedEnvironment.coordinates],
  );

  const isRotatedPolygonInside = useMemo(() => {
    const environmentPolygon = turf.polygon([environmentCoordinates]);
    const rotatedPolygon = turf.polygon([rotatedPolygonCoordinates]);
    return turf.booleanContains(environmentPolygon, rotatedPolygon);
  }, [environmentCoordinates, rotatedPolygonCoordinates]);

  useEffect(() => {
    if (!environmentCoordinates.length) return;

    setLandReady(false);

    const polygon = turf.polygon([environmentCoordinates]);
    const [longitude, latitude] = turf.center(polygon).geometry.coordinates;
    setMarkerPosition({ latitude, longitude });

    const mapInstance = map.current;
    const revealAfterMapSettles = () => {
      mapInstance.once("idle", revealLand);
    };
    const revealLand = () => setLandReady(true);

    mapInstance.once("moveend", revealAfterMapSettles);

    flyToMapPosition({
      mapRef: map,
      latitude,
      longitude,
      bounds: turf.bbox(polygon),
      padding: 80,
      maxZoom: 19,
      rotate: false,
      marker: false,
    });

    return () => {
      mapInstance.off("moveend", revealAfterMapSettles);
      mapInstance.off("idle", revealLand);
    };
  }, [environmentCoordinates]);
  useEffect(() => {
    if (isConfirmed) return;

    const handleMove = () => {
      const { lat, lng } = map.current.getCenter();
      setMarkerPosition({ latitude: lat, longitude: lng });
    };

    map.current.on("move", handleMove);
    return () => map.current.off("move", handleMove);
  }, [map, isConfirmed]);
  const handleConfirmation = useCallback(() => {
    if (!isRotatedPolygonInside) {
      ToastError(getTranslation(1946));
    } else {
      setIsConfirmed(true);
      ToastSuccess(getTranslation(1945));
    }
  }, [isRotatedPolygonInside]);

  const handelSubmitEnvironment = useCallback(() => {
    resetStates();
  }, [resetStates]);

  const handleCancelPlacement = useCallback(() => {
    const featureId = formState?.featureId;
    resetStates();
    navigate(featureId ? `/feature/${featureId}/building` : "/", {
      replace: true,
    });
  }, [formState?.featureId, navigate, resetStates]);
  const polygonVisibility = modelReady && !isConfirmed ? "visible" : "none";
  return (
    <>
      {showPolygon && (
        <Source
          id="construction-rotation-polygon"
          type="geojson"
          data={{
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [rotatedPolygonCoordinates],
            },
          }}
        >
          <Layer
            id="construction-rotation-fill-layer"
            type="fill"
            layout={{ visibility: polygonVisibility }}
            paint={{ "fill-color": isRotatedPolygonInside ? "green" : "red" }}
          />
          <Layer
            id="construction-rotation-outline-layer"
            type="line"
            layout={{ visibility: polygonVisibility }}
            paint={{ "line-color": "#000000", "line-width": 2 }}
          />
        </Source>
      )}
      {isLoading && <ClipLoader color="#36d7b7" />}
      {landReady && (
        <Canvas
          latitude={markerPosition.latitude}
          longitude={markerPosition.longitude}
        >
          <FBXModel
            url={selectedEnvironment.file.url}
            rotation={[0, (rotationX * Math.PI) / 180, 0]}
            setLoading={setIsLoading}
            onReady={setModelReady}
          />
        </Canvas>
      )}
      {showPolygon && (
        <AngleControl
          step={isConfirmed ? "form" : "angle"}
          value={rotationX}
          position={markerPosition}
          onChange={setRotationX}
          onConfirm={handleConfirmation}
          onCancel={handleCancelPlacement}
          onBack={() => setIsConfirmed(false)}
          onSubmitted={handelSubmitEnvironment}
        />
      )}
    </>
  );
});

export default Mark;
