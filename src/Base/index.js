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
    noDataComponent = () => "No Data",
    ...props
  },
  ref
) {
  const {
    orderBy,
    setOrderBy,
    loading,
    data,
    setRefresh,
    setCurrentPage,
    totalRecords,
    filters,
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
              <div
                className={classNames(
                  config.tableWrapperClasses ||
                    "shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                )}
              >
                <table
                  className={classNames(
                    config.tableClasses || "min-w-full divide-y divide-gray-200"
                  )}
                >
                  <thead
                    className={classNames(config.theadClasses || "bg-gray-50")}
                  >
                    <tr>
                      {config.columns.map((row, i) => (
                        <Header
                          config={config}
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
                  <tbody
                    className={classNames(
                      config.tbodyClasses || "overflow-y-auto"
                    )}
                  >
                    {config.filterable && (
                      <tr
                        className={classNames(
                          config.filterRowClasses || "bg-gray-50"
                        )}
                      >
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
                        <td
                          colSpan={config.columns.length}
                          className="py-32 text-2xl font-medium"
                        >
                          {noDataComponent}
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
