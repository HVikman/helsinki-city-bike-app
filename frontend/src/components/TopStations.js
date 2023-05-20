import React from "react";

function TopStations({ topStations }) {
  const emptyRows = Array(5).fill({ station_name: "", count: "" });

  const rowsToRender = topStations.length > 0 ? topStations : emptyRows;

  return (
    <table>
      <thead>
        <tr>
          <th>Station Name</th>
          <th>Journeys</th>
        </tr>
      </thead>
      <tbody>
        {rowsToRender.map((station, index) => (
          <tr key={index}>
            <td>
              {station.station_name || (
                <div className="placeholder">Loading...</div>
              )}
            </td>
            <td>
              {station.count || <div className="placeholder">Loading...</div>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TopStations;
