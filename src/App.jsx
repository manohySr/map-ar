import { useState, useEffect } from "react";
import "./App.css";
import ARComponent from "./ARComponent";
import MapComponent from "./MapComponent";
import Search from "./Search";

const headerSearch = {
  position: "absolute",
  top: "0",
  right: "1rem",
  width: "80%",
  zIndex: "1000",
};

const arButton = {
  position: "absolute",
  bottom: "1rem",
  left: "1rem",
  zIndex: "1000",
};

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [zoom, setZoom] = useState(13);
  const [route, setRoute] = useState(null);
  const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    // Get the user's current location when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const userPosition = [latitude, longitude];
          setOrigin(userPosition);
        },
        (error) => {
          console.error(`Error Code = ${error.code}: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      {showAR ? (
        <>
          {/* AR View */}
          <ARComponent destination={destination} />
          <button
            style={arButton}
            onClick={() => setShowAR(false)} // Switch back to the map
          >
            Back to Map
          </button>
        </>
      ) : (
        <>
          <div style={headerSearch}>
            <Search
              origin={origin}
              setDestination={setDestination}
              setZoom={setZoom}
              setRoute={setRoute}
            />
          </div>
          <MapComponent
            zoom={zoom}
            origin={origin}
            destination={destination}
            route={route}
          />
          <button
            style={arButton}
            onClick={() => setShowAR(true)} // Switch to AR view
          >
            AR
          </button>
        </>
      )}
    </>
  );
}

export default App;
