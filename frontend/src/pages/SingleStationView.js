import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import "../styles/SingleStationView.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

function SingleStationView({ stationId, onClose }) {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/stations/station/${stationId}`
        );
        console.log(response.data);
        setStation(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStation();
  }, [stationId]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    // Create the map and marker when the station data is available
    if (station) {
      L.Marker.prototype.setIcon(
        L.icon({
          iconUrl: markerIconPng,
        })
      );
      const map = L.map("map").setView([station.y, station.x], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      L.marker([station.y, station.x]).addTo(map);
    }
  }, [station]);

  if (loading) {
    return (
      <div className="popup-container" onClick={handleClose}>
        <ScaleLoader
          color={"#36D7B7"}
          className="spinner"
          loading={loading}
          size={35}
        />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="popup-container" onClick={handleClose}>
        <p>Station not found.</p>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
      </div>
    );
  }

  return (
    <div className="popup-container" onClick={handleClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          X
        </button>
        <h1>{station.name}</h1>
        <p>Address: {station.address}</p>
        <p>
          Total journeys starting from this station: {station.departures_count}
        </p>
        <p>Total journeys ending at this station: {station.returns_count}</p>
        <div id="map"></div>
      </div>
    </div>
  );
}

export default SingleStationView;
