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

  let watchId = null; // To store the ID of the geolocation watcher

  //  to start watching the user's location
  function startWatchingPosition() {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const userPosition = [latitude, longitude];
          setOrigin(userPosition); // Update origin in real-time
        },
        (error) => {
          console.error(`Error Code = ${error.code}: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }, // Config options
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  // Stop watching when the component unmounts
  function stopWatchingPosition() {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  // Start watching position on component mount, and stop on unmount
  useEffect(() => {
    startWatchingPosition();
    return () => stopWatchingPosition(); // Cleanup on unmount
  }, []);

  return (
    <>
      {showAR ? (
        <>
          {/* AR View */}
          {
            route ? (
              <>
                <ARComponent route={route} origin={origin} />
                <button
                  style={arButton}
                  onClick={() => setShowAR(false)} // Switch back to the map
                >
                  Back to Map
                </button>
              </>
            ) : (
              alert("You haven't entered anything") || setShowAR(false)
            ) // Show alert and return to map view
          }
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
