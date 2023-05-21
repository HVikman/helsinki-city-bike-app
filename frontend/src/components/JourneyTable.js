import React from "react";

function JourneyTable({ journeys, rows }) {
  const isLoading = !journeys || journeys.length === 0;
  const rowsToRender = isLoading ? Array(rows).fill(null) : journeys;

  return (
    <table>
      <thead>
        <tr>
          <th>Departure</th>
          <th>Return</th>
          <th>Distance</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {rowsToRender.map((journey, index) => (
          <tr key={index}>
            {isLoading ? (
              <>
                <td className="placeholder">Loading...</td>
                <td className="placeholder">Loading...</td>
                <td className="placeholder">Loading...</td>
                <td className="placeholder">Loading...</td>
              </>
            ) : (
              <>
                <td>{journey.departure_name}</td>
                <td>{journey.return_name}</td>
                <td>{(journey.distance / 1000).toFixed(1)}km</td>
                <td>
                  {Math.floor(journey.duration / 60)}:
                  {journey.duration % 60 >= 10
                    ? journey.duration % 60
                    : "0" + (journey.duration % 60)}
                </td>
              </>
            )}
          </tr>
        ))}
        {!isLoading && journeys.length === 0 && (
          <tr>
            <td colSpan={4} style={{ textAlign: "center" }}>
              No journeys found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default JourneyTable;
