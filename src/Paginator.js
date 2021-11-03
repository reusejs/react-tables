import React, { useState, useEffect } from "react";
import "./tailwind.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ({
  totalRecords,
  pageLimit,
  pageNeighbours,
  onPageChanged,
}) {
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalRecords / pageLimit)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);

  const LEFT_PAGE = "LEFT";
  const RIGHT_PAGE = "RIGHT";

  const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  const gotoPage = (page) => {
    const currentPage = Math.max(1, Math.min(page, totalPages));

    const paginationData = {
      currentPage,
      totalPages: totalPages,
      pageLimit: pageLimit,
      totalRecords: totalRecords,
    };

    setCurrentPage(currentPage);
    onPageChanged(paginationData);
  };

  const handleClick = (page, evt) => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = (evt) => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  useEffect(() => {
    setPages(fetchPageNumbers());
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageLimit));
  }, [totalRecords]);

  useEffect(() => {
    gotoPage(1);
    setPages(fetchPageNumbers());
  }, [totalPages]);

  useEffect(() => {
    // console.log(pages);
  }, [pages]);

  return (
    <div className="flex items-center justify-between mt-4 py-3 bg-white border-t border-gray-200">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => {
            gotoPage(currentPage - 1);
          }}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        >
          Previous
        </button>
        <button
          onClick={() => {
            gotoPage(currentPage + 1);
          }}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 leading-5">
            Total <span className="font-medium">{totalRecords}</span> Records
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex shadow-sm">
            {pages.length &&
              pages.map((page, index) => {
                if (page === LEFT_PAGE) {
                  return (
                    <button
                      key={`b${index}`}
                      className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 leading-5 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                      aria-label="Previous"
                      onClick={(e) => {
                        handleMoveLeft(e);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  );
                }

                if (page === RIGHT_PAGE) {
                  return (
                    <button
                      key={`b${index}`}
                      className="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 leading-5 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                      aria-label="Next"
                      onClick={(e) => {
                        handleMoveRight(e);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  );
                }

                return (
                  <button
                    key={`b${index}`}
                    className={classNames(
                      "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150",
                      currentPage === page ? "text-indigo-800 bg-gray-50" : ""
                    )}
                    onClick={(e) => handleClick(page, e)}
                  >
                    {page}
                  </button>
                );
              })}
          </nav>
        </div>
      </div>
    </div>
  );
}
