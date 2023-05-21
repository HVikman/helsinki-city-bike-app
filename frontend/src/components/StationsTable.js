function StationsTable({
  stations,
  onRowClick,
  onSort,
  sortBy,
  sortDirection,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort("id")}>
            ID
            {sortBy === "id" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
          <th onClick={() => onSort("name")}>
            Name
            {sortBy === "name" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
          <th onClick={() => onSort("address")}>
            Address
            {sortBy === "address" && (
              <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
            )}
          </th>
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
