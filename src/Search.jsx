import { useState } from "react";

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

function Search({ origin, setDestination, setZoom, setRoute }) {
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

      if (destinationData.length === 0) {
        alert("No results found.");
        return;
      }

      const [lat, lon] = [
        parseFloat(destinationData[0].lat),
        parseFloat(destinationData[0].lon),
      ];
      const newDestination = [lat, lon];

      setDestination(newDestination);
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
        (coord) => [coord[1], coord[0]]
      );

      const routeDistance =
        routeData.features[0].properties.segments[0].distance;
      setRoute(coordinates);
      setDistance(routeDistance);

      console.log(`Most efficient itinerary distance: ${routeDistance} meters`);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching the route.");
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

export default Search;
