import React from "react";
import { BarLoader } from "react-spinners";

function StationInfo({ station, averages }) {
  return (
    <div className="popup-content">
      <h1>{station.name}</h1>
      <h3>{station.address}</h3>
      <hr />
      <p>
        Total journeys starting from this station: {station.departures_count}
      </p>
      {averages ? (
        <p>
          with average distance of {(averages.avgstart / 1000).toFixed(1)}km
        </p>
      ) : (
        <BarLoader
          color={"gray"}
          width={220}
          height={10}
          speedMultiplier={0.5}
        />
      )}

      <hr />
      <p>Total journeys ending at this station: {station.returns_count}</p>
      {averages ? (
        <p>with average distance of {(averages.avgend / 1000).toFixed(1)}km</p>
      ) : (
        <BarLoader
          color={"gray"}
          width={220}
          height={10}
          speedMultiplier={0.5}
        />
      )}
      <hr />
      <div id="map"></div>
    </div>
  );
}

export default StationInfo;
