import React, { useState, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import Header from "./Header";
import Row from "./Row";
import Filter from "./Filter";
import Paginator from "../Paginator";
import "../tailwind.css";
import useDataTable from "../useDataTable";
import { classNames } from "@reusejs/react-utils";

const Table = React.forwardRef(function Table(
  {
    config,
    defaultSortColumn,
    dataSource,
    perPage,
    params,
    sortOrder = "asc",
    ...props
  },
  ref
) {
  const {
    orderBy,
    setOrderBy,
    loading,
    setLoading,
    data,
    setData,
    refresh,
    setRefresh,
    currentPage,
    setCurrentPage,
    totalRecords,
    setTotalRecords,
    filters,
    setFilters,
    applyFilter,
  } = useDataTable({
    sortOrder,
    defaultSortColumn,
    config,
    dataSource,
    perPage,
    params,
  });

  useImperativeHandle(ref, () => {
    return {
      refresh: () => {
        setRefresh(true);
      },
    };
  });

  return (
    <>
      {loading && <Skeleton count={10} />}
      {!loading && (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead
                    className={classNames(props.theadClasses || "bg-gray-50")}
                  >
                    <tr className="w-full">
                      {config.columns.map((row, i) => (
                        <Header
                          label={row.label}
                          identifier={row.identifier}
                          sortable={row.sortable}
                          key={`th${i}`}
                          orderBy={orderBy}
                          setOrderBy={setOrderBy}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {config.filterable && (
                      <tr className="bg-gray-50">
                        {config.columns.map((row, i) => (
                          <Filter
                            filters={filters}
                            item={row}
                            key={`filter${i}`}
                            applyFilter={(v) => {
                              applyFilter(row, v);
                            }}
                          />
                        ))}
                      </tr>
                    )}

                    {data.length ? (
                      data.map((item, i) => (
                        <Row
                          item={item}
                          i={i}
                          config={config}
                          key={`row${i}`}
                        />
                      ))
                    ) : (
                      <tr className="text-center bg-white">
                        <td colSpan="6" className="py-32 text-2xl font-medium">
                          No Data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalRecords / perPage > 1 && (
            <Paginator
              totalRecords={totalRecords}
              pageLimit={perPage}
              pageNeighbours={1}
              onPageChanged={(data) => {
                setCurrentPage(data.currentPage);
              }}
            />
          )}
        </div>
      )}
    </>
  );
});

Table.propTypes = {
  config: PropTypes.object.isRequired,
};

Table.defaultProps = {
  config: [],
  perPage: 8,
};

const titleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default Table;
