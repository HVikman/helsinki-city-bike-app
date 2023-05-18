import React from "react";

function JourneyTable({ journeys }) {
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
        {journeys && journeys.length > 0 ? (
          journeys.map((journey) => (
            <tr key={journey.id}>
              <td>{journey.departure_name}</td>
              <td>{journey.return_name}</td>
              <td>{journey.distance} m</td>
              <td>
                {Math.floor(journey.duration / 60)}:
                {journey.duration % 60 >= 10
                  ? journey.duration % 60
                  : "0" + (journey.duration % 60)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>No journeys found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default JourneyTable;
