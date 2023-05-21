import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import JourneyTable from "../JourneyTable";

describe("JourneyTable", () => {
  test("should render a table with the correct headings", () => {
    render(<JourneyTable journeys={[]} rows={5} />);

    const headings = screen.getAllByRole("columnheader");
    expect(headings).toHaveLength(4);
    expect(headings[0]).toHaveTextContent("Departure");
    expect(headings[1]).toHaveTextContent("Return");
    expect(headings[2]).toHaveTextContent("Distance");
    expect(headings[3]).toHaveTextContent("Duration");
  });

  test("should render journeys data correctly", () => {
    const journeys = [
      {
        departure_name: "A",
        return_name: "B",
        distance: "1500",
        duration: "90",
      },
    ];

    render(<JourneyTable journeys={journeys} rows={5} />);

    const dataCells = screen.getAllByRole("cell");
    expect(dataCells).toHaveLength(4);

    expect(dataCells[0]).toHaveTextContent("A");
    expect(dataCells[1]).toHaveTextContent("B");
    expect(dataCells[2]).toHaveTextContent("1.5km");
    expect(dataCells[3]).toHaveTextContent("1:30");
  });

  test("should render loading placeholders when journeys are being fetched", () => {
    render(<JourneyTable journeys={null} rows={10} />);

    const placeholders = screen.getAllByText("Loading...");
    expect(placeholders).toHaveLength(40);
  });
});
