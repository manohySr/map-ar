import { Fragment, useState, useEffect } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0); // Track current entity index

  useEffect(() => {
    if (origin && route.length > 0) {
      const currentCoord = route[currentIndex]; // Current point to reach
      const nextCoord = route[currentIndex + 1]; // Next point (if any)

      // Calculate distance to the current and next points
      const distanceToCurrent = getDistanceFromLatLon(
        origin[0],
        origin[1],
        currentCoord[0],
        currentCoord[1],
      );

      const distanceToNext = nextCoord
        ? getDistanceFromLatLon(
            origin[0],
            origin[1],
            nextCoord[0],
            nextCoord[1],
          )
        : Infinity; // If no next point, set distance to Infinity

      console.log(`Distance to current point: ${distanceToCurrent}m`);
      console.log(`Distance to next point: ${distanceToNext}m`);

      // If the distance to the next point is smaller, move to the next entity
      if (
        distanceToNext < distanceToCurrent &&
        currentIndex < route.length - 1
      ) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [origin, currentIndex, route]); // Re-run when origin or index changes

  const currentCoord = route[currentIndex]; // Get the coordinates of the current entity
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
          zIndex: "1000",
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
    <>
      <a-entity
        material={`color: ${color}`}
        geometry="primitive: box"
        gps-new-entity-place={`latitude: ${lat}; longitude: ${long}`}
        scale="2.5 2.5 1"
        position="0 -3 0"
        animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
      ></a-entity>
    </>
  );
}

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
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
