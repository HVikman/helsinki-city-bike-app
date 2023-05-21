import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StationInfo from "../StationInfo";

describe("StationInfo", () => {
  const station = {
    name: "Station A",
    address: "Katutie 1",
    departures_count: 10,
    returns_count: 5,
  };

  const averages = {
    avgstart: 5000,
    avgend: 7000,
  };

  test("renders station name and address", () => {
    render(<StationInfo station={station} />);
    const nameElement = screen.getByText("Station A");
    const addressElement = screen.getByText("Katutie 1");

    expect(nameElement).toBeInTheDocument();
    expect(addressElement).toBeInTheDocument();
  });

  test("renders total journeys starting from the station", () => {
    render(<StationInfo station={station} />);
    const departuresElement = screen.getByText(
      "Total journeys starting from this station: 10"
    );

    expect(departuresElement).toBeInTheDocument();
  });

  test("renders average distance for journeys starting from the station when averages are available", () => {
    render(<StationInfo station={station} averages={averages} />);
    const avgStartElement = screen.getByText("with average distance of 5.0km");

    expect(avgStartElement).toBeInTheDocument();
  });

  test("does not render loading spinner when averages are available", () => {
    render(
      <StationInfo
        station={station}
        averages={{ avgstart: 1000, avgend: 2000 }}
      />
    );
    const spinnerElement = screen.queryByRole("progressbar");

    expect(spinnerElement).not.toBeInTheDocument();
  });

  test("renders total journeys ending at the station", () => {
    render(<StationInfo station={station} />);
    const returnsElement = screen.getByText(
      "Total journeys ending at this station: 5"
    );

    expect(returnsElement).toBeInTheDocument();
  });

  test("renders average distance for journeys ending at the station when averages are available", () => {
    render(<StationInfo station={station} averages={averages} />);
    const avgEndElement = screen.getByText("with average distance of 7.0km");

    expect(avgEndElement).toBeInTheDocument();
  });
});
