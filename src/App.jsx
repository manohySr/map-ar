import { useState } from "react";
import "./App.css";

function App() {
  const [position, setPosition] = useState([-18.9005824, 47.529984]);
  const [zoom, setZoom] = useState(13); // Initialize zoom level

  return (
    <>
      <Search setPosition={setPosition} setZoom={setZoom} />
      <MapComponent position={position} zoom={zoom} />
    </>
  );
}

export default App;

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useEffect } from "react";

function MapComponent({ position, zoom }) {
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
      <Marker position={position}>
        <Popup>You are here.</Popup>
      </Marker>
    </MapContainer>
  );
}



const styleSearch = {
  display: "flex",
  margin: "1rem",
  gap: ".5rem"
};

const styleInput = {
  padding: "0 .5rem",
  fontSize: "1rem",
};

function Search({ setPosition, setZoom }) {
  const [searching, setSearching] = useState("");

  async function handleSearch() {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searching}`
      );
      const jsonData = await response.json();
      if (jsonData.length > 0) {
        const newPosition = [jsonData[0].lat, jsonData[0].lon];
        setPosition(newPosition);
        setZoom(16); // Adjust zoom level when a new location is found
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
        value={searching}
        onChange={(e) => setSearching(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
