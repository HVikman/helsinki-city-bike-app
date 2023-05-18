import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/ListView.css";
import SingleStationView from "./SingleStationView";
import Pagination from "../components/Pagination";
import StationsTable from "../components/StationsTable";

function StationList() {
  const [stations, setStations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedStationId, setSelectedStationId] = useState(null);

  const handleClick = (stationId) => {
    setSelectedStationId(stationId);
  };

  const handleClose = () => {
    setSelectedStationId(null);
  };

  useEffect(() => {
    //Fetch total pages when site loads and when pagesize changes
    const fetchTotalPages = async () => {
      setTotalPages(0);
      try {
        const response = await axios.get(
          "http://localhost:4000/stations/totalpages",
          {
            params: {
              pageSize: pageSize,
            },
          }
        );
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalPages();
  }, [pageSize]);

  const fetchStations = useCallback(async () => {
    try {
      console.log("Fetching stations...");
      const response = await axios.get("http://localhost:4000/stations", {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
      });
      setStations(response.data.stations);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

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
      {selectedStationId && (
        <SingleStationView
          stationId={selectedStationId}
          onClose={handleClose}
        />
      )}
      <h1>Station List</h1>
      <StationsTable stations={stations} onRowClick={handleClick} />

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

export default StationList;
