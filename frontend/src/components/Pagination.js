import React, { useEffect } from "react";

function Pagination({
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  pageSize,
  changePageSize,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      // Go to the next page
      goToNextPage();
    } else if (event.key === "ArrowLeft" && currentPage > 1) {
      // Go to the previous page
      goToPreviousPage();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="pagination">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Previous
      </button>
      <span>
        Current Page: {currentPage}/{totalPages > 0 ? totalPages : "Loading..."}
      </span>
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Next
      </button>
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

export default Pagination;
