import { memo, useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { Canvas, NearCoordinates } from "react-three-map/maplibre";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils";
import { isValidJalaaliDate, toGregorian } from "jalaali-js";

const getConstructionEndDate = (date) => {
  if (typeof date !== "string") return new Date(date);

  const match = date.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (!match) return new Date(date);

  const [, yearText, monthText, dayText, hourText, minuteText, secondText] =
    match;
  const year = Number(yearText);
  if (year >= 1700) return new Date(date);

  const month = Number(monthText);
  const day = Number(dayText);
  if (!isValidJalaaliDate(year, month, day)) return new Date(NaN);

  const { gy, gm, gd } = toGregorian(year, month, day);
  return new Date(
    gy,
    gm - 1,
    gd,
    Number(hourText) || 0,
    Number(minuteText) || 0,
    Number(secondText) || 0,
  );
};

const FBXModel = memo(({ url, rotation, setLoading, opacity }) => {
  const fbx = useLoader(FBXLoader, url, (loader) => {
    loader.manager.onStart = () => setLoading(true);
    loader.manager.onLoad = () => setLoading(false);
    loader.manager.onError = () => setLoading(false);
  });

  const clonedScene = useMemo(() => cloneSkeleton(fbx), [fbx]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      const applyOpacity = (material) => {
        material.transparent = true;
        material.opacity = opacity;
        material.depthWrite = opacity === 1;
        material.needsUpdate = true;
      };

      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => material.clone());
        child.material.forEach(applyOpacity);
      } else if (child.material) {
        child.material = child.material.clone();
        applyOpacity(child.material);
      }
    });
  }, [clonedScene, opacity]);

  return (
    <group rotation={rotation} scale={0.0097}>
      <hemisphereLight args={["#ffffff", "#60666C"]} intensity={12} />
      <primitive object={clonedScene} />
    </group>
  );
});

const MapBuildings = ({ buildings, selectedEnvironment, setLoading }) => (
  <Canvas
    latitude={30.233922946967866}
    longitude={54.20761223027057}
    key={selectedEnvironment ? selectedEnvironment.id : "no-env"}
  >
    {buildings.map((model) => {
      const endDate = getConstructionEndDate(
        model?.building?.construction_end_date,
      );
      const opacity = model.opacity ?? (new Date() < endDate ? 0.3 : 1);
      const [latitude, longitude] = model?.building?.position
        ?.split(",")
        .map(Number);

      return (
        <NearCoordinates
          key={model.uniqueKey}
          latitude={latitude}
          longitude={longitude}
        >
          <FBXModel
            opacity={opacity}
            url={model.file.url}
            rotation={[0, model?.building?.rotation ?? 0, 0]}
            setLoading={setLoading}
          />
        </NearCoordinates>
      );
    })}
  </Canvas>
);

export default MapBuildings;
