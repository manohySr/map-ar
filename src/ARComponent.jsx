import { Fragment } from "react";

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
  return (
    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; trackingMethod: best; debugUIEnabled: false"
      renderer="antialias: true; alpha: true;"
      style={style}
    >
      <a-camera gps-new-camera="gpsMinDistance: 10;"></a-camera>
      {route.map((coord, index) => {
        const color =
          index === 0 || index === route.length - 1 ? "green" : "red";
        return (
          <Fragment key={index}>
            <ArEntity color={color} lat={coord[0]} long={coord[1]} />
          </Fragment>
        );
      })}
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
