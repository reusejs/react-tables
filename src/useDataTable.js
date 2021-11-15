import React, { useEffect, useState } from "react";
import isEqual from "lodash/isEqual";
import eventBus from "./eventBus";

export default function ({
  sortOrder,
  config,
  defaultSortColumn,
  dataSource,
  perPage,
  params,
}) {
  const [orderBy, setOrderBy] = useState({
    sortOrder: sortOrder,
    sortColumn: config["columns"][defaultSortColumn]["identifier"],
  });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [refresh, setRefresh] = useState(false);
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

      setRefresh(false);
      setTotalRecords(r.pagination.total);
      setData(r.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setRefresh(false);
      setLoading(false);
    }
  };

  const applyFilter = (column, value) => {
    console.log("applFilter", column, value);

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

  return {
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
  };
}
