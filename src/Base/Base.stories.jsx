import React, { useRef, useState } from "react";
import Table from "./index";
import "../tailwind.css";

const multiple = true;
const valueKey = "id";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const fetchPackages = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(
        `https://api.npms.io/v2/search?q=${params.filters.name}&size=${
          params.per_page
        }&from=${(params.page - 1) * params.per_page}`
      );
      response = await response.json();

      let packages = response.results.map((p) => {
        p["id"] = uuidv4();
        return p;
      });

      response["results"] = packages;

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  title: "Tables/Table",
  component: Table,
};

const Template = (args) => {
  const tableRef = useRef(null);

  const [selected, setSelected] = useState([]);

  // console.log('selected ----->', selected);

  const addOrRemove = (option) => {
    console.log("addOrRemove", selected);

    if (!multiple) {
      setSelected([option]);
    } else {
      if (!selected.some((current) => current[valueKey] === option[valueKey])) {
        //   console.log('Item not present.. add it');
        setSelected([...selected, option]);
      } else {
        console.log("Item present.. remove it");

        let selectionAfterRemoval = selected;
        selectionAfterRemoval = selectionAfterRemoval.filter(
          (current) => current[valueKey] !== option[valueKey]
        );
        setSelected([...selectionAfterRemoval]);
      }
    }
  };

  const config = {
    // rowEvenClasses: "bg-red-50",
    filterable: true,
    columns: [
      {
        label: "ID",
        identifier: "id",
        resolver: (d) => {
          return (
            <div>
              <input
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                onChange={(e) => {
                  addOrRemove(d);
                }}
              />
            </div>
          );
        },
        sortable: false,
        filterable: {
          type: "text",
        },
      },
      {
        label: "ID",
        identifier: "id",
        resolver: (d) => {
          return d.id;
        },
        sortable: false,
        filterable: {
          type: "text",
        },
      },
      {
        label: "Package Name",
        identifier: "name",
        resolver: (d) => {
          return d.package.name;
        },
        sortable: false,
        filterable: {
          type: "text",
        },
      },
      {
        label: "Publisher",
        identifier: "publisher",
        resolver: (d) => {
          return d.package.publisher.username;
        },
        sortable: false,
      },
      {
        label: "Version",
        identifier: "last_used_human",
        resolver: (d) => {
          return d.package.version;
        },
        sortable: false,
      },
      {
        label: "",
        filterable: {
          type: "clear",
        },
        actions: true,
        links: [],
      },
    ],
  };

  return (
    <div className="w-1/2 overflow-hidden">
      <Table
        ref={tableRef}
        config={config}
        defaultSortColumn={0}
        perPage={20}
        dataSource={async (params) => {
          let response = await fetchPackages(params);
          // console.log("params", params)

          return {
            data: response.results,
            pagination: {
              total: response.total,
            },
          };
        }}
      />
    </div>
  );
};

const EmptyTemplate = (args) => {
  const tableRef = useRef(null);

  const config = {
    // rowEvenClasses: "bg-red-50",
    filterable: true,
    columns: [
      {
        label: "ID",
        identifier: "id",
        resolver: (d) => {
          return d.id;
        },
        sortable: false,
      },
      {
        label: "Package Name",
        identifier: "name",
        resolver: (d) => {
          return d.package.name;
        },
        sortable: false,
      },
      {
        label: "Publisher",
        identifier: "publisher",
        resolver: (d) => {
          return d.package.publisher.username;
        },
        sortable: false,
      },
      {
        label: "Version",
        identifier: "last_used_human",
        resolver: (d) => {
          return d.package.version;
        },
        sortable: false,
      },
    ],
  };

  return (
    <div className="w-1/2 overflow-hidden">
      <Table
        {...args}
        ref={tableRef}
        config={config}
        defaultSortColumn={0}
        perPage={20}
        dataSource={async (params) => {
          let response = [];
          // console.log("params", params)

          return {
            data: [],
            // pagination: {
            //   total: ,
            // },
          };
        }}
      />
    </div>
  );
};

export const Basic = Template.bind({});
export const EmptyTable = EmptyTemplate.bind({});

Basic.args = {};
EmptyTable.args = {
  noDataComponent: (
    <div className="flex flex-col items-center relative -top-14">
      <img
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.FmrNStLXQb1YOEIMjBUk7wHaE7%26pid%3DApi&f=1"
        className="object-contain w-40"
      />
      <p className="text-red-400 mt-3">Oops! No Data</p>
    </div>
  ),
};
