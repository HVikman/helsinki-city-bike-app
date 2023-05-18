import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/ListView.css";
import JourneyTable from "../components/JourneyTable";
import Pagination from "../components/Pagination";

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

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      // Go to the next page
      setCurrentPage(currentPage + 1);
    } else if (event.key === "ArrowLeft" && currentPage > 1) {
      // Go to the previous page
      setCurrentPage(currentPage - 1);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const changePageSize = (event) => {
    setPageSize(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>Journey List</h1>
      <JourneyTable journeys={journeys} />

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
