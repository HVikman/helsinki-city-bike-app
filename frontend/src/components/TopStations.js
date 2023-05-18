import React from "react";
import { PuffLoader } from "react-spinners";

function TopStations({ topStations }) {
  return (
    <>
      {topStations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Station Name</th>
              <th>Journeys</th>
            </tr>
          </thead>
          <tbody>
            {topStations.map((station, index) => (
              <tr key={index}>
                <td>{station.station_name}</td>
                <td>{station.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <PuffLoader
          className="spinner"
          color={"gray"}
          size={200}
          speedMultiplier={1}
        />
      )}
    </>
  );
}

export default TopStations;
