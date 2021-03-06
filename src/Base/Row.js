import React, { forwardRef } from "react";
import { classNames } from "@reusejs/react-utils";

const Row = forwardRef(function Row({ item, config, i }, ref) {
  return (
    <tr
      className={classNames(
        item.itemClasses || "",
        i % 2 === 0
          ? config.rowEvenClasses || "bg-white"
          : config.rowOddClasses || "bg-gray-50"
      )}
      key={`tr${i}`}
    >
      {config["columns"].map((c, j) => (
        <td
          key={`td${i}${j}`}
          className={classNames(
            config.rowTdClasses ||
              "px-6 py-4 whitespace-nowrap text-sm text-gray-500"
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
                      "text-blue-500 hover:text-blue-900 capitalize cursor-pointer focus:outline-none inline-flex items-center",
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
