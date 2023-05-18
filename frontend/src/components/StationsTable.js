function StationsTable({ stations, onRowClick }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {stations && stations.length > 0 ? (
          stations.map((station) => (
            <tr
              key={station.id}
              onClick={() => onRowClick(station.id)}
              className="station-row"
              title="Click for station information"
            >
              <td>{station.id}</td>
              <td>{station.name}</td>
              <td>{station.address}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td>No stations found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default StationsTable;
