import React, { useRef } from 'react';
import Table from './index';
import "../tailwind.css"

const fetchPackages = async (params) => {

    return new Promise(async (resolve, reject) => {

        try {
            let response = await fetch(`https://api.npms.io/v2/search?q=${params.filters.name}&size=${params.per_page}&from=${(params.page - 1) * params.per_page}`);
            response = await response.json();
            resolve(response)

        } catch (error) {
            reject(error)
        }
    })
};

export default {
    title: 'Tables/Table',
    component: Table,
};

const Template = (args) => {
    const tableRef = useRef(null);

    const config = {
        // rowEvenClasses: "bg-red-50",
        filterable: true,
        columns: [
            {
                label: 'Package Name',
                identifier: 'name',
                resolver: (d) => {
                    return d.package.name;
                },
                sortable: false,
                filterable: {
                    type: 'text',
                },
            },
            {
                label: 'Publisher',
                identifier: 'publisher',
                resolver: (d) => {
                    return d.package.publisher.username;
                },
                sortable: false,
            },
            {
                label: 'Version',
                identifier: 'last_used_human',
                resolver: (d) => {
                    return d.package.version;
                },
                sortable: false
            },
            {
                label: '',
                filterable: {
                    type: 'clear',
                },
                actions: true,
                links: []
            }
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
        </div>)
}

export const Basic = Template.bind({});

Basic.args = {

};
