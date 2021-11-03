import React, { useRef } from 'react';
import { Table as DataTable } from './index';
import "../tailwind.css"

const fetchPackages = async (query = "react") => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(`https://api.npms.io/v2/search?q=${query}`);
            response = await response.json();
            resolve(response.results)

        } catch (error) {
            reject(error)
        }
    })
};

export default {
    title: 'Tables/DataTable',
    component: DataTable,
};

const Template = (args) => {
    const tableRef = useRef(null);

    const config = {
        filterable: false,
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
                filterable: {
                    type: 'text',
                },
            },
            {
                label: 'Version',
                identifier: 'last_used_human',
                resolver: (d) => {
                    return d.package.version;
                },
                sortable: false,
                filterable: {
                    type: 'text',
                },
            },
        ],
    };

    return (
        <div className="w-1/2">
            <DataTable
                ref={tableRef}
                config={config}
                defaultSortColumn={0}
                perPage={1}
                dataSource={async (params) => {
                    let response = await fetchPackages();
                    return {
                        data: response,
                        pagination: {
                            total: 0,
                        },
                    };
                }}
            />
        </div>)
}

export const Basic = Template.bind({});

Basic.args = {

};
