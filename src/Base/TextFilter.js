import React, { forwardRef, useState } from "react";
import eventBus from "../eventBus";

const TextFilter = forwardRef(function TextFilter({ onChange, ...other }, ref) {
  const [filterText, setFilterText] = useState("");

  eventBus.on("clear", () => {
    setFilterText("");
  });

  const clearText = () => {
    onChange("");
    setFilterText("");
  };

  const handleOnChange = (value) => {
    onChange(value);
    setFilterText(value);
  };

  return (
    <>
      <div className="relative inline-block">
        <div>
          <span className="rounded-md">
            <div
              className="inline-flex items-center justify-center w-full py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer leading-5 hover:text-gray-500 transition ease-in-out duration-150"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <input
                type="text"
                value={filterText}
                onChange={(e) => {
                  handleOnChange(e.target.value);
                }}
                placeholder="Type to Filter.."
                className="px-1 text-xs text-gray-700 bg-gray-100 focus:bg-white focus:outline-none focus:shadow-outline"
              />

              <svg
                className="w-5 h-5 ml-2 -mr-1 cursor-pointer"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                stroke="#6b7280"
                onClick={clearText}
              >
                {filterText && <path d="M6 18L18 6M6 6l12 12" />}
              </svg>
            </div>
          </span>
        </div>
      </div>
    </>
  );
});

TextFilter.defaultProps = {
  onChange: () => {},
};

export default TextFilter;
