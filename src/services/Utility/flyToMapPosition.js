export const flyToMapPosition = ({
  mapRef,
  latitude,
  longitude,
  zoom = 17,
  bearing = 0,
  pitch = 50,
  rotate = true,
  marker = true,
  bounds,
  padding = 80,
  maxZoom = 19,
}) => {
  const mapInstance = mapRef?.current ?? mapRef?.default;
  if (!mapInstance) return;

  const map = mapInstance.getMap();
  map.setMaxZoom(22);

  if (map.getSource("location-icon")) {
    map.removeLayer("location-icon-layer");
    map.removeSource("location-icon");
  }

  const addMarker = (image) => {
    if (!map.hasImage("custom-marker")) {
      map.addImage("custom-marker", image);
    }

    map.addSource("location-icon", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
    });

    map.addLayer({
      id: "location-icon-layer",
      type: "symbol",
      source: "location-icon",
      layout: {
        "icon-image": "custom-marker",
        "icon-size": 0.65,
        "icon-offset": [0, -15],
      },
    });
  };

  if (marker) {
    map
      .loadImage("https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png")
      .then((image) => {
        addMarker(image.data ?? image);
      })
      .catch((error) => {
        console.error("خطا در بارگذاری آیکون مارکر:", error);
      });
  }

  map.stop();

  const camera = bounds
    ? map.cameraForBounds(bounds, { padding, maxZoom })
    : { center: [longitude, latitude], zoom, bearing, pitch };

  map.flyTo({
    ...camera,
    essential: true,
    speed: 1.2,
    curve: 1.42,
  });

  if (!rotate) return;

  map.once("moveend", () => {
    let rotation = 0;

    const rotateCamera = () => {
      if (rotation <= 360) {
        rotation += 3;
        map.rotateTo(rotation, { duration: 100 });
        requestAnimationFrame(rotateCamera);
      }
    };

    rotateCamera();
  });
};