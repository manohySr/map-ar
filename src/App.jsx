import { useState } from "react";
import "./App.css";

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [position, setPosition] = useState([-18.9005824, 47.529984]);
  const [zoom, setZoom] = useState(13);
  const [route, setRoute] = useState(null);

  return (
    <>
      <Search
        setOrigin={setOrigin}
        setDestination={setDestination}
        setPosition={setPosition}
        setZoom={setZoom}
        setRoute={setRoute}
      />
      <MapComponent
        position={position}
        zoom={zoom}
        origin={origin}
        destination={destination}
        route={route}
      />
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
import { useRef, useEffect } from "react";

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
      style={{ height: "90vh", width: "100vw" }}
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
          <Popup>Origin</Popup>
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
  padding: "0 .5rem",
  fontSize: "1rem",
};

function Search({ setOrigin, setDestination, setPosition, setZoom, setRoute }) {
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [distance, setDistance] = useState(null);

  async function handleSearch() {
    try {
      const originResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${originSearch}`
      );
      const originData = await originResponse.json();
      const destinationResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destinationSearch}`
      );
      const destinationData = await destinationResponse.json();

      if (originData.length > 0 && destinationData.length > 0) {
        const newOrigin = [
          parseFloat(originData[0].lat),
          parseFloat(originData[0].lon),
        ];
        const newDestination = [
          parseFloat(destinationData[0].lat),
          parseFloat(destinationData[0].lon),
        ];

        setOrigin(newOrigin);
        setDestination(newDestination);
        setPosition(newOrigin);
        setZoom(13); // Adjust zoom level when new locations are found

        const routeResponse = await fetch(
          `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${
            import.meta.env.VITE_API_KEY
          }&start=${newOrigin[1]},${newOrigin[0]}&end=${newDestination[1]},${
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
        value={originSearch}
        onChange={(e) => setOriginSearch(e.target.value)}
        placeholder="Origin..."
      />
      <input
        style={styleInput}
        type="text"
        value={destinationSearch}
        onChange={(e) => setDestinationSearch(e.target.value)}
        placeholder="Destination..."
      />
      <button onClick={handleSearch}>Search</button>
      {distance && <p>Distance: {distance} meters</p>}
    </div>
  );
}
