import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useMapData } from "../../hooks/useMapData.js";
import { Layer, Marker, Source, useMap } from "react-map-gl/maplibre";

const FlagIcon = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: baseline;
`;

const Div2 = styled.div`
  width: 85%;
  height: 8px;
  background: linear-gradient(
    to bottom,
    ${(props) => props.color || "blue"},
    white,
    ${(props) => props.color || "blue"}
  );
  border-radius: 2px;
`;

const Div3 = styled.div`
  width: 70%;
  background: ${(props) => props.color || "blue"};
  writing-mode: vertical-rl;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  font-family: brunoace;
`;

const Div4 = styled.div`
  width: 8px;
  height: 20px;
  background: linear-gradient(
    to right,
    ${(props) => props.color || "blue"},
    white,
    ${(props) => props.color || "blue"}
  );
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const normalizeCoordinatePair = (value) => {
  if (!value) return null;

  let parsedValue = value;

  if (typeof value === "string") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      const parts = value
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((part) => Number.isFinite(part));

      if (parts.length >= 2) {
        parsedValue = parts.slice(0, 2);
      }
    }
  }

  if (Array.isArray(parsedValue)) {
    const [firstValue, secondValue] = parsedValue;
    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue);

    if (![firstNumber, secondNumber].every((number) => Number.isFinite(number))) {
      return null;
    }

    if (Math.abs(firstNumber) <= 90 && Math.abs(secondNumber) <= 180) {
      return { latitude: firstNumber, longitude: secondNumber };
    }

    if (Math.abs(firstNumber) <= 180 && Math.abs(secondNumber) <= 90) {
      return { latitude: secondNumber, longitude: firstNumber };
    }

    return { latitude: firstNumber, longitude: secondNumber };
  }

  if (typeof parsedValue === "object") {
    const latitude = Number(parsedValue.latitude ?? parsedValue.lat ?? parsedValue.y);
    const longitude = Number(
      parsedValue.longitude ?? parsedValue.lng ?? parsedValue.lon ?? parsedValue.x,
    );

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }
  }

  return null;
};

const normalizePolygonCoordinates = (coordinates = []) =>
  coordinates.map(([firstValue, secondValue]) => {
    const firstNumber = Number(firstValue);
    const secondNumber = Number(secondValue);

    if (![firstNumber, secondNumber].every((number) => Number.isFinite(number))) {
      return [firstNumber, secondNumber];
    }

    if (Math.abs(firstNumber) <= 90 && Math.abs(secondNumber) <= 180) {
      return [secondNumber, firstNumber];
    }

    if (Math.abs(firstNumber) <= 180 && Math.abs(secondNumber) <= 90) {
      return [firstNumber, secondNumber];
    }

    return [secondNumber, firstNumber];
  });

const MapFlag = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.current?.getZoom() ?? 14);
  const { flags, polygons } = useMapData();

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap) return;

    const handleViewportChange = () => {
      setZoomLevel(currentMap.getZoom());
    };

    currentMap.on("zoomend", handleViewportChange);

    return () => {
      currentMap.off("zoomend", handleViewportChange);
    };
  }, [map]);

  const mappedFlags = useMemo(
    () =>
      zoomLevel < 14
        ? flags.map((flag, index) => {
            const normalizedCoordinates = normalizeCoordinatePair(
              flag.central_point_coordinates,
            );

            if (!normalizedCoordinates) return null;

            const { latitude, longitude } = normalizedCoordinates;

            return (
              <Marker
                key={flag.id ?? index}
                longitude={longitude}
                latitude={latitude}
                style={{ top: "-50px" }}
              >
                <FlagIcon>
                  <Div2 color={flag.color} />
                  <Div3 color={flag.color}>{flag.name}</Div3>
                  <Div4 color={flag.color} />
                </FlagIcon>
              </Marker>
            );
          })
        : [],
    [flags, zoomLevel],
  );

  const mappedPolygons = useMemo(
    () => (
      <Source
        id="area"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: polygons.map((polygon) => ({
            type: "Feature",
            properties: {
              id: polygon.id,
            },
            geometry: {
              type: "Polygon",
              coordinates: [normalizePolygonCoordinates(polygon.coordinates)],
            },
          })),
        }}
      >
        <Layer
          id="polygon-fill"
          type="fill"
          paint={{
            "fill-color": "blue",
            "fill-opacity": 0.4,
          }}
        />
      </Source>
    ),
    [polygons],
  );

  useEffect(() => {
    if (polygons.length > 0 && polygons.length <= 2) {
      const currentMap = map.current;
      if (!currentMap) return;

      let minLat = Infinity;
      let minLng = Infinity;
      let maxLat = -Infinity;
      let maxLng = -Infinity;

      polygons.forEach((polygon) => {
        polygon.coordinates.forEach(([lat, lng]) => {
          const firstNumber = Number(lat);
          const secondNumber = Number(lng);

          if (![firstNumber, secondNumber].every((number) => Number.isFinite(number))) {
            return;
          }

          const normalizedPoint =
            Math.abs(firstNumber) <= 90 && Math.abs(secondNumber) <= 180
              ? [secondNumber, firstNumber]
              : [firstNumber, secondNumber];

          const [normalizedLng, normalizedLat] = normalizedPoint;

          minLat = Math.min(minLat, normalizedLat);
          minLng = Math.min(minLng, normalizedLng);
          maxLat = Math.max(maxLat, normalizedLat);
          maxLng = Math.max(maxLng, normalizedLng);
        });
      });

      if (Number.isFinite(minLat) && Number.isFinite(minLng)) {
        currentMap.fitBounds([
          [minLng, minLat],
          [maxLng, maxLat],
        ]);
      }
    }
  }, [map, polygons]);

  return (
    <>
      {mappedPolygons}
      {mappedFlags}
    </>
  );
};

export default MapFlag;
