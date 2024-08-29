import { Fragment } from "react";
import { useEffect } from "react";

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

function ARComponent({ route }) {
  const coords = parseCoordinates(route);
  console.log(coords); // Check the parsed coordinates

  return (
    <div style={style}>
      <script src="https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js"></script>
      <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
      <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>

      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; trackingMethod: best; debugUIEnabled: false"
        renderer="antialias: true; alpha: true;"
        style={style}
      >
        <a-camera gps-new-camera="gpsMinDistance: 10;"></a-camera>
        {coords.map((coord, index) => (
          <a-entity
            key={index}
            material="color: red"
            geometry="primitive: box"
            gps-new-entity-place={`latitude: ${coord.lat}; longitude: ${coord.lon}`}
            scale="1.15 -1.5 5.2"
          ></a-entity>
        ))}
      </a-scene>
    </div>
  );
}

export default ARComponent;

const parseCoordinates = (data) => {
  const coordinates = [];
  for (let i = 0; i < data.length; i += 18) {
    const lat = parseFloat(data.slice(i, i + 9));
    const lon = parseFloat(data.slice(i + 9, i + 18));
    coordinates.push({ lat, lon });
  }
  return coordinates;
};

{
  /* <script type='text/javascript' src='https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js'></script>
<script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"></script>

<a-scene vr-mode-ui='enabled: false' arjs='sourceType: webcam; videoTexture: true; trackingMethod: best; debugUIEnabled: false' renderer='antialias: true; alpha: true;'>
  <a-camera gps-new-camera='gpsMinDistance: 10;'></a-camera>
  <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: -18.939801; longitude: 47.4347766" scale="1.15 -1.5 5.2"></a-entity>
  <a-entity material='color: white' geometry='primitive: box' gps-new-entity-place="latitude: -18.939857; longitude: 47.434805" scale="0.25 0.25 0.175"></a-entity>
  <a-entity material='color: blue' geometry='primitive: box' gps-new-entity-place="latitude: -18.9398568; longitude: 47.4348530" scale="0.15 0.3 3.35"></a-entity>
  <a-entity material='color: green' geometry='primitive: box' gps-new-entity-place="latitude: -18.9398832; longitude: 47.4345721" scale="1.5 0.15 0.7"></a-entity>
  <a-entity material='color: blue' geometry='primitive: box' gps-new-entity-place="latitude: -18.939912; longitude: 47.434441" scale="1.5 0.15 0.7"></a-entity>
  <a-entity material='color: red' geometry='primitive: box' gps-new-entity-place="latitude: -18.939878; longitude: 47.434346" scale="1.5 -1.5 4.35" position="0 5 0"></a-entity>
  <a-entity material='color: yellow' geometry='primitive: box' gps-new-entity-place="latitude: -18.939906; longitude: 47.434181" scale="1.5 0.15 0.7"></a-entity>
  <a-entity material='color: green' geometry='primitive: sphere' gps-new-entity-place="latitude: -18.939836; longitude: 47.434511" scale="1.5 0.15 0" position="0 1 1"></a-entity>
  <a-text value="88888" scale="15 15 5" gps-entity-place="latitude: -18.939879; longitude: 47.434346;" geometry="primitive: plane"></a-text>
  <a-entity material='color: teal' geometry='primitive: cone' gps-new-entity-place="latitude: -18.939878; longitude: 47.434346" scale="1.5 -1.5 4" position="0 -50 0"></a-entity>
</a-scene> */
}
