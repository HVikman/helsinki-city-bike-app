import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/ListView.css";
import JourneyTable from "../components/JourneyTable";
import Pagination from "../components/Pagination";

const apiurl = "http://localhost:4000";

function JourneyList() {
  const [journeys, setJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    //fetch amount of pages when site loads and when pagesize changes
    const fetchTotalPages = async () => {
      setTotalPages(0);
      try {
        const response = await axios.get(`${apiurl}/journeys/totalpages/`, {
          params: {
            pageSize: pageSize,
          },
        });
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
      const response = await axios.get(`${apiurl}/journeys/`, {
        params: {
          page: currentPage,
          pageSize: pageSize,
          sortBy: sortBy,
          sortDirection: sortDirection,
        },
      });
      console.log(response.data);
      setJourneys(response.data.journeys);
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, pageSize, sortBy, sortDirection]);

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

  const handleSort = (column) => {
    // Update sort column and direction
    if (sortBy === column) {
      // If already sorted by the same column, toggle the direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting a different column, set it as the new sort column with the default direction
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <div>
      <h1>Journey List</h1>
      <JourneyTable
        journeys={journeys}
        rows={pageSize}
        onSort={handleSort}
        sortBy={sortBy}
        sortDirection={sortDirection}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        pageSize={pageSize}
        changePageSize={changePageSize}
      />
    </div>
  );
}

export default JourneyList;
