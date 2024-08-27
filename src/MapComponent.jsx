import { useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({ zoom, origin, destination, route }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && origin) {
      mapRef.current.setView(origin, zoom);
    }
  }, [origin, zoom]);

  return (
    <MapContainer
      center={origin || [0, 0]} // Fallback center in case origin is not available yet
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

export default MapComponent;
