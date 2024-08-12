import { useState, useEffect } from "react";
import "./App.css";

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
}

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [position, setPosition] = useState([-18.9005824, 47.529984]);
  const [zoom, setZoom] = useState(13);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    // Get the user's current location when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const userPosition = [latitude, longitude];
          setOrigin(userPosition);
          setPosition(userPosition);
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
      <div style={headerSearch}>
        <Search
          origin={origin}
          setDestination={setDestination}
          setPosition={setPosition}
          setZoom={setZoom}
          setRoute={setRoute}
        />
      </div>
      <MapComponent
        position={position}
        zoom={zoom}
        origin={origin}
        destination={destination}
        route={route}
      />
      <button style={arButton}>AR</button>
    </>
  );
}

export default App;

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef } from "react";

function MapComponent({ position, zoom, origin, destination, route }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(position, zoom);
    }
  }, [position, zoom]);

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "100vh", width: "100vw" }}
      whenReady={(map) => {
        mapRef.current = map.target;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {origin && (
        <Marker position={origin}>
          <Popup>Current Location</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {route && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
}

const styleSearch = {
  display: "flex",
  flexDirection: "column",
  margin: "1rem",
  gap: ".5rem",
};

const styleInput = {
  borderRadius: "8px",
  border: "1px solid #213547",
  padding: "0.8em 1.2em",
  fontSize: "1em",
  background: "white",
  color: "#000",
};

function Search({ origin, setDestination, setPosition, setZoom, setRoute }) {
  const [destinationSearch, setDestinationSearch] = useState("");
  const [distance, setDistance] = useState(null);

  async function handleSearch() {
    if (!origin) {
      alert("Current location is not available.");
      return;
    }

    try {
      const destinationResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destinationSearch}`
      );
      const destinationData = await destinationResponse.json();

      if (destinationData.length > 0) {
        const newDestination = [
          parseFloat(destinationData[0].lat),
          parseFloat(destinationData[0].lon),
        ];

        setDestination(newDestination);
        setPosition(newDestination);
        setZoom(15); // Adjust zoom level when a new location is found

        const routeResponse = await fetch(
          `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${
            import.meta.env.VITE_API_KEY
          }&start=${origin[1]},${origin[0]}&end=${newDestination[1]},${
            newDestination[0]
          }`
        );
        const routeData = await routeResponse.json();
        const coordinates = routeData.features[0].geometry.coordinates.map(
          function (coord) {
            return [coord[1], coord[0]];
          }
        );

        const routeDistance =
          routeData.features[0].properties.segments[0].distance;
        setRoute(coordinates);
        setDistance(routeDistance);

        console.log(
          `Most efficient itinerary distance: ${routeDistance} meters`
        );
      } else {
        alert("No results found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div style={styleSearch}>
      <input
        style={styleInput}
        type="text"
        value={destinationSearch}
        onChange={(e) => setDestinationSearch(e.target.value)}
        placeholder="Destination..."
      />
      <button onClick={handleSearch}>Search</button>
      {distance && <p style={{ color: "#000" }}>Distance: {distance} meters</p>}
    </div>
  );
}
