import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  margin: 0,
  padding: 0,
};

function ARComponent({ route, origin }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current point
  const ARRIVAL_THRESHOLD = 10; // Threshold distance in meters

  useEffect(() => {
    if (origin && route.length > 0) {
      const currentCoord = route[currentIndex];
      const distanceToCurrent = getDistanceFromLatLon(
        origin[0],
        origin[1],
        currentCoord[0],
        currentCoord[1],
      );

      console.log(`Distance to current point: ${distanceToCurrent}m`);

      // Check if the user arrived at the current point
      if (
        distanceToCurrent < ARRIVAL_THRESHOLD &&
        currentIndex < route.length - 1
      ) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [origin, currentIndex, route]);

  const currentCoord = route[currentIndex]; // Get coordinates of the current entity
  const color =
    currentIndex === 0 || currentIndex === route.length - 1 ? "green" : "red";

  return (
    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; trackingMethod: best; debugUIEnabled: false"
      renderer="antialias: true; alpha: true;"
      style={style}
    >
      <a-camera gps-new-camera="gpsMinDistance: 10;"></a-camera>
      {/* Render the current ArEntity */}
      <ArEntity color={color} lat={currentCoord[0]} long={currentCoord[1]} />
      <p
        style={{
          color: "white",
          position: "absolute",
          zIndex: 1000,
          top: 10,
          left: 10,
        }}
      >
        Current point: {currentIndex + 1} / {route.length}
      </p>
    </a-scene>
  );
}

export default ARComponent;

function ArEntity({ color, lat, long }) {
  return (
    <a-entity
      material={`color: ${color}`}
      geometry="primitive: box"
      gps-new-entity-place={`latitude: ${lat}; longitude: ${long}`}
      scale="2.5 2.5 1"
      position="0 -3 0"
      animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
    ></a-entity>
  );
}

// Calculate distance between two GPS points using the Haversine formula
function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}
