import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopStations from "../TopStations";

test("renders empty rows with placeholders when topStations is empty", () => {
  const topStations = [];
  render(<TopStations topStations={topStations} />);

  const emptyRows = screen.getAllByText("Loading...");
  expect(emptyRows.length).toBe(10); // 2 rows with placeholders per empty row

  emptyRows.forEach((row) => {
    expect(row).toBeInTheDocument();
  });
});

test("renders rows with station names and journey counts when topStations is not empty", () => {
  const topStations = [
    { station_name: "Station A", count: 10 },
    { station_name: "Station B", count: 5 },
    { station_name: "Station C", count: 3 },
  ];
  render(<TopStations topStations={topStations} />);

  const stationNames = screen.getAllByText(/Station [A-C]/);
  const journeyCounts = screen.getAllByText(/(10|5|3)/);

  expect(stationNames.length).toBe(topStations.length);
  expect(journeyCounts.length).toBe(topStations.length);

  stationNames.forEach((name) => {
    expect(name).toBeInTheDocument();
  });

  journeyCounts.forEach((count) => {
    expect(count).toBeInTheDocument();
  });
});
