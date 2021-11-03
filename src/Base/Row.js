import React, { forwardRef } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Row = forwardRef(function Row({ item, config, i }, ref) {
  return (
    <tr
      className="px-6 py-4 whitespace-nowrap"
      key={`tr${i}`}
      onClick={() => {
        // console.log("On click");
      }}
    >
      {config["columns"].map((c, j) => (
        <td
          key={`td${i}${j}`}
          className={classNames(
            "px-6 py-4 whitespace-normal text-sm leading-5",
            c.actions !== true && j === 0 ? "font-medium text-gray-900" : "",
            c.actions !== true && j > 0 ? "text-gray-500" : "",
            c.actions === true
              ? ""
              : "text-right font-medium flex items-center justify-end"
          )}
        >
          {c.actions !== true && c.resolver(item)}
          {c.actions === true &&
            c.links.map((link, i) => {
              if (link.condition(item)) {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      link.resolver(item);
                    }}
                    className={classNames(
                      "text-blue-500 hover:text-blue-900 capitalize inline-block cursor-pointer focus:outline-none",
                      i > 0 ? "ml-2" : ""
                    )}
                    key={`link${i}`}
                  >
                    {link.icon(item)}
                  </button>
                );
              }
            })}
        </td>
      ))}
    </tr>
  );
});

Row.defaultProps = {};

export default Row;
