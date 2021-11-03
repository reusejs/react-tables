import React, { useState, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import Header from "./Header";
import Row from "./Row";
import Filter from "./Filter";
import isEqual from "lodash/isEqual";
import eventBus from "../eventBus";
import Paginator from "../Paginator";
import "../tailwind.css";

const Table = React.forwardRef(function Table(
  { config, defaultSortColumn, dataSource, perPage, params, sortOrder = "asc" },
  ref
) {
  const [orderBy, setOrderBy] = useState({
    sortOrder: sortOrder,
    sortColumn: config["columns"][defaultSortColumn]["identifier"],
  });
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (refresh === true) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchData();
      }
    }
  }, [refresh]);

  useEffect(() => {
    fetchData();
  }, [orderBy, filters, currentPage]);

  const applyFilter = (column, value) => {
    let prepareFilters = Object.assign({}, filters);
    if (column.filterable) {
      switch (column.filterable.type) {
        case "text":
          if (value) {
            prepareFilters[column.identifier] = value;
          } else {
            delete prepareFilters[column.identifier];
          }
          break;

        case "checkbox":
          if (value.length) {
            prepareFilters[column.identifier] = value;
          } else {
            delete prepareFilters[column.identifier];
          }
          break;

        case "clear":
          eventBus.dispatch("clear");
          prepareFilters = {};
          break;

        default:
          break;
      }
    }

    if (!isEqual(prepareFilters, filters)) {
      setFilters(prepareFilters);
    }
  };

  const fetchData = async () => {
    try {
      let r = await dataSource({
        per_page: perPage,
        page: currentPage,
        sort_column: orderBy.sortColumn,
        sort_order: orderBy.sortOrder,
        filters: filters,
        ...params,
      });

      // console.log('Data r', r);

      setRefresh(false);
      setTotalRecords(r.pagination.total);
      setData(r.data);
      setLoading(false);
    } catch (error) {
      setRefresh(false);
      setLoading(false);
    }
  };

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
                  <thead className="bg-gray-50 w-full relative overflow-y-scroll">
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
                  <tbody
                    className="w-full overflow-y-scroll"
                    style={{
                      maxHeight: "50vh",
                    }}
                  >
                    {config.filterable && (
                      <tr className="bg-gray-50 w-full">
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

export { Table, titleCase };
