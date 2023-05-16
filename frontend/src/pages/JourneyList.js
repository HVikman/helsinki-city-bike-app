import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/ListView.css";

function JourneyList() {
  const [journeys, setJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    //fetch amount of pages when site loads and when pagesize changes
    const fetchTotalPages = async () => {
      setTotalPages(0);
      try {
        const response = await axios.get(
          "http://localhost:4000/journeys/totalpages",
          {
            params: {
              pageSize: pageSize,
            },
          }
        );
        console.log(response.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalPages();
  }, [pageSize]);

  const fetchJourneys = useCallback(async () => {
    //fetch list of journeys from backend
    try {
      console.log("fetching...");
      const response = await axios.get("http://localhost:4000/journeys", {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
      });
      console.log(response.data);
      setJourneys(response.data.journeys);
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePageSize = (event) => {
    setPageSize(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>Journey List</h1>
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
                  {journey.duration % 60 > 10
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

      <div className="pagination">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span>
          Current Page: {currentPage}/
          {totalPages > 0 ? totalPages : "Loading..."}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      <div className="size">
        <label htmlFor="pageSize">Page Size:</label>
        <select id="pageSize" value={pageSize} onChange={changePageSize}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}

export default JourneyList;
