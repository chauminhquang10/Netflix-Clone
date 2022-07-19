import React from "react";

const Pagination = ({ currentPage, moviesPerPage, totalMovies, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        <button className="page-link" onClick={() => paginate(1)}>
          1
        </button>
        {currentPage >= 4 && <button className="page-link">...</button>}
        {pageNumbers.map(
          (number) =>
            (number + 1 === currentPage + 1 ||
              number + 1 === currentPage - 1 ||
              number + 1 === currentPage) &&
            number < pageNumbers.length - 1 && (
              <li key={number + 1} className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              </li>
            )
        )}
        {currentPage < pageNumbers.length - 2 && (
          <button className="page-link">...</button>
        )}
        {pageNumbers.length > 1 && (
          <button
            className="page-link"
            onClick={() => paginate(pageNumbers.length)}
          >
            {pageNumbers.length}
          </button>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
