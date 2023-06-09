import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import "../styles/SingleStationView.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import StationInfo from "../components/StationInfo";
import TopStations from "../components/TopStations";

function SingleStationView({ stationId, onClose, apiurl }) {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averages, setAverages] = useState(null);
  const [topEndStations, setTopEndStations] = useState([]);
  const [topStartStations, setTopStartStations] = useState([]);

  useEffect(() => {
    const stationCancelToken = axios.CancelToken.source();
    const averagesCancelToken = axios.CancelToken.source();
    const topEndCancelToken = axios.CancelToken.source();
    const topStartCancelToken = axios.CancelToken.source();

    const fetchStation = async () => {
      setLoading(true);
      setAverages(null);
      setTopEndStations([]);
      setTopStartStations([]);

      try {
        const response = await axios.get(
          `${apiurl}/stations/station/${stationId}`,
          {
            cancelToken: stationCancelToken.token,
          }
        );

        console.log(response.data);
        setStation(response.data);
        setLoading(false);

        fetchAdditionalData();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAdditionalData = async () => {
      try {
        const [averagesResponse, topEndResponse, topStartResponse] =
          await Promise.all([
            axios.get(`${apiurl}/stations/averages/${stationId}`, {
              cancelToken: averagesCancelToken.token,
            }),
            axios.get(`${apiurl}/stations/endstations/${stationId}`, {
              cancelToken: topEndCancelToken.token,
            }),
            axios.get(`${apiurl}/stations/startstations/${stationId}`, {
              cancelToken: topStartCancelToken.token,
            }),
          ]);

        console.log(averagesResponse.data);
        console.log(topEndResponse.data);
        console.log(topStartResponse.data);

        setAverages(averagesResponse.data);
        setTopEndStations(topEndResponse.data);
        setTopStartStations(topStartResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStation();

    return () => {
      stationCancelToken.cancel("Station request canceled");
      averagesCancelToken.cancel("Averages request canceled");
      topEndCancelToken.cancel("Top End request canceled");
      topStartCancelToken.cancel("Top Start request canceled");
    };
  }, [apiurl, stationId]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    // create map and marker when the station data is available
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
          color={"gray"}
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
        <StationInfo station={station} averages={averages} />

        <div className="popup-divider"></div>
        <div className="popup-right">
          <div className="popup-right-info">
            <h3>Top journey end stations</h3>
            <TopStations topStations={topEndStations} />
          </div>

          <div className="popup-right-info">
            <h3>Top journey start stations</h3>
            <TopStations topStations={topStartStations} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleStationView;
