import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "../Pagination";

describe("Pagination", () => {
  const mockGoToPreviousPage = jest.fn();
  const mockGoToNextPage = jest.fn();
  const mockChangePageSize = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the current page and total pages", () => {
    const currentPage = 2;
    const totalPages = 10;

    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={mockGoToPreviousPage}
        goToNextPage={mockGoToNextPage}
        pageSize={10}
        changePageSize={mockChangePageSize}
      />
    );

    const currentPageElement = screen.getByText(
      `Current Page: ${currentPage}/${totalPages}`
    );
    expect(currentPageElement).toBeInTheDocument();
  });

  test("should disable previous button when on the first page", () => {
    const currentPage = 1;
    const totalPages = 10;

    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={mockGoToPreviousPage}
        goToNextPage={mockGoToNextPage}
        pageSize={10}
        changePageSize={mockChangePageSize}
      />
    );

    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();
  });

  test("should disable next button when on the last page", () => {
    const currentPage = 10;
    const totalPages = 10;

    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={mockGoToPreviousPage}
        goToNextPage={mockGoToNextPage}
        pageSize={10}
        changePageSize={mockChangePageSize}
      />
    );

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  test("should call goToPreviousPage when previous button is clicked", () => {
    const currentPage = 2;
    const totalPages = 10;

    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={mockGoToPreviousPage}
        goToNextPage={mockGoToNextPage}
        pageSize={10}
        changePageSize={mockChangePageSize}
      />
    );

    const previousButton = screen.getByText("Previous");
    fireEvent.click(previousButton);

    expect(mockGoToPreviousPage).toHaveBeenCalledTimes(1);
  });

  test("should call goToNextPage when next button is clicked", () => {
    const currentPage = 2;
    const totalPages = 10;

    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={mockGoToPreviousPage}
        goToNextPage={mockGoToNextPage}
        pageSize={10}
        changePageSize={mockChangePageSize}
      />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(mockGoToNextPage).toHaveBeenCalledTimes(1);
  });
});
