import React, { forwardRef } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Disabled({ setSort }) {
  return (
    <svg
      className="inline w-4 h-4 ml-2 -mr-1 cursor-pointer asc"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      stroke="#cbd5e0"
      onClick={() => {
        setSort();
      }}
    >
      <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  );
}

function Ascending({ onClick }) {
  return (
    <svg
      className="inline w-4 h-4 ml-2 -mr-1 cursor-pointer asc"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      stroke="#4a5568"
      onClick={() => {
        onClick();
      }}
    >
      <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  );
}

function Descending({ onClick }) {
  return (
    <svg
      className="inline w-4 h-4 ml-2 -mr-1 cursor-pointer desc"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      stroke="#4a5568"
      onClick={() => {
        onClick();
      }}
    >
      <path d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
    </svg>
  );
}

function SortColumns({ sort, setSort }) {
  return (
    <>
      {sort === "asc" ? (
        <Ascending
          onClick={() => {
            setSort("desc");
          }}
        />
      ) : (
        <Descending
          onClick={() => {
            setSort("asc");
          }}
        />
      )}
    </>
  );
}

const Header = forwardRef(function Header(
  { label, orderBy, setOrderBy, sortable, identifier },
  ref
) {
  const sortColumn = orderBy.sortColumn;
  const sortOrder = orderBy.sortOrder;

  return (
    <th
      className={classNames(
        identifier !== ""
          ? "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          : "",
        identifier === "" ? "relative px-6 py-3" : ""
      )}
    >
      {label}
      {sortable && identifier === sortColumn && (
        <SortColumns
          sort={sortOrder}
          setSort={(order) => {
            setOrderBy({
              sortOrder: order,
              sortColumn: identifier,
            });
          }}
        />
      )}
      {sortable && identifier !== sortColumn && (
        <Disabled
          setSort={() => {
            setOrderBy({
              sortOrder: "asc",
              sortColumn: identifier,
            });
          }}
        />
      )}
    </th>
  );
});

Header.defaultProps = {
  label: "",
  identifier: "",
  sortOrder: "asc",
  sortable: false,
  orderBy: {},
  setOrderBy: () => {},
};

export default Header;
