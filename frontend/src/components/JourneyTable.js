import React from "react";

function JourneyTable({ journeys, rows, onSort, sortBy, sortDirection }) {
  const isLoading = !journeys || journeys.length === 0;
  const rowsToRender = isLoading ? Array(rows).fill(null) : journeys;

  return (
    <table>
      <thead>
        <tr>
          <th
            onClick={() => onSort("departure_name")}
            title="Click to sort column"
          >
            Departure Name
            {sortBy === "departure_name" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
          <th
            onClick={() => onSort("return_name")}
            title="Click to sort column"
          >
            Return Name
            {sortBy === "return_name" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
          <th onClick={() => onSort("distance")} title="Click to sort column">
            Distance
            {sortBy === "distance" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
          <th onClick={() => onSort("duration")} title="Click to sort column">
            Duration
            {sortBy === "duration" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
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
