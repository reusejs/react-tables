import React, { forwardRef, useState, useEffect } from "react";
import includes from "lodash/includes";
import indexOf from "lodash/indexOf";
import filter from "lodash/filter";
import map from "lodash/map";
import join from "lodash/join";
import { useOutsideClicker } from "@reusejs/react-utils";
import eventBus from "../eventBus";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SelectFilter = forwardRef(function SelectFilter(
  { onChange, options, selected, ...other },
  ref
) {
  const visRef = useOutsideClicker(() => {
    setIsOn(false);
  });

  const [isOn, setIsOn] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState(selected);
  const [labelText, setLabelText] = useState("");

  const computeLabelText = (choices) => {
    let labels = map(
      filter(options, (p) => {
        return includes(choices, p.value);
      }),
      "label"
    );

    if (labels.length) {
      setLabelText(`(${labels.length}) ` + join(labels, ", "));
    } else {
      setLabelText("");
    }
  };

  useEffect(() => {
    computeLabelText(selectedChoices);
  }, [selectedChoices]);

  eventBus.on("clear", () => {
    setSelectedChoices([]);
    computeLabelText([]);
  });

  const clearFilter = () => {
    setSelectedChoices([]);
    computeLabelText([]);
    onChange([]);
  };

  const handleOnChange = (val, checked) => {
    let value = selectedChoices;

    if (checked) {
      let index = indexOf(value, val);
      if (index === -1) {
        value.push(val);
      }
    } else {
      let index = indexOf(value, val);
      if (index !== -1) {
        value.splice(index, 1);
      }
    }
    setSelectedChoices([...value]);
    computeLabelText([...value]);
    onChange([...value]);
  };

  return (
    <>
      <div className="relative inline-block" ref={visRef}>
        <div>
          <span className="rounded-md">
            <div
              onClick={() => setIsOn(!isOn)}
              className="inline-flex items-center justify-center w-full py-2 text-xs font-medium text-gray-500 uppercase cursor-pointer leading-5 hover:text-gray-500 transition ease-in-out duration-150"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <input
                value={labelText}
                type="text"
                disabled
                className="px-1 text-xs text-gray-400 bg-gray-100 cursor-not-allowed"
              />

              <svg
                className="w-3 h-3 ml-2 -mr-1"
                viewBox="0 0 20 20"
                fill="#6b7280"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </span>
        </div>

        {isOn && (
          <div className="absolute left-0 w-40 font-normal shadow-lg origin-top-left rounded-md">
            <div className="bg-white rounded-md shadow-xs">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="block px-4 py-4">
                  {options.map((option, i) => {
                    return (
                      <div
                        className={classNames(i > 0 ? "mt-1" : "")}
                        key={`row${i}`}
                      >
                        <div className="relative flex items-start items-center">
                          <div className="flex items-center h-5">
                            <input
                              id={`checkbox${option.value}`}
                              type="checkbox"
                              onChange={(e) => {
                                handleOnChange(option.value, e.target.checked);
                              }}
                              checked={includes(selectedChoices, option.value)}
                              value={option.value}
                              className="w-3 h-3 text-indigo-600 form-checkbox transition duration-150 ease-in-out"
                            />
                          </div>
                          <div className="ml-2 text-sm leading-5">
                            <label
                              htmlFor={`checkbox${option.value}`}
                              className="text-xs font-normal text-gray-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-2 text-right">
                    <span
                      className="text-xs text-gray-500 capitalize cursor-pointer hover:text-gray-700"
                      onClick={clearFilter}
                    >
                      Clear
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

SelectFilter.defaultProps = {
  onChange: () => {},
  options: [],
  selected: [],
};

export default SelectFilter;
