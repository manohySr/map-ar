import React, { useEffect } from "react";
import "aframe";
import "@ar-js-org/ar.js";

function ARComponent({ destination }) {
  useEffect(() => {
    if (destination) {
      // AR.js setup for location-based AR
      const scene = document.querySelector("a-scene");
      if (scene) {
        scene.innerHTML = `
          <a-camera gps-camera rotation-reader></a-camera>
          <a-entity 
            gps-entity-place="latitude: ${destination[0]}; longitude: ${destination[1]};" 
            name="destination-marker"
            geometry="primitive: box; height: 2; width: 2; depth: 2"
            material="color: red;"
          ></a-entity>
        `;
      }
    }
  }, [destination]);

  return (
    <a-scene
      vr-mode-ui="enabled: false"
      embedded
      arjs="sourceType: webcam; debugUIEnabled: true;"
    >
      <a-text value="Loading AR..." position="0 0.5 -3"></a-text>
    </a-scene>
  );
}

export default ARComponent;
