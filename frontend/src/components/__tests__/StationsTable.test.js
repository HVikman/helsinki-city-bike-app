import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import StationsTable from "../StationsTable";

const stations = [
  { id: 1, name: "Station A", address: "Katu 1" },
  { id: 2, name: "Station B", address: "Kuja 2" },
  { id: 3, name: "Station C", address: "Tie 3" },
];

test("renders table with station data", () => {
  render(<StationsTable stations={stations} />);
  const table = screen.getByRole("table");
  const tableRows = screen.getAllByRole("row");

  expect(table).toBeInTheDocument();
  expect(tableRows.length).toBe(stations.length + 1); // +1 for header row
});

test("renders 'No stations found.' when stations array is empty", () => {
  render(<StationsTable stations={[]} />);
  const noStationsRow = screen.getByText("No stations found.");

  expect(noStationsRow).toBeInTheDocument();
});

test("calls onRowClick callback with station ID when a row is clicked", () => {
  const mockOnRowClick = jest.fn();
  render(<StationsTable stations={stations} onRowClick={mockOnRowClick} />);
  const clickableRows = screen.getAllByTitle("Click for station information");

  clickableRows.forEach((row) => {
    fireEvent.click(row);
  });

  expect(mockOnRowClick).toHaveBeenCalledTimes(stations.length);
  expect(mockOnRowClick.mock.calls).toEqual(
    stations.map((station) => [station.id])
  );
});
