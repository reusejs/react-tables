import React, { useRef } from 'react';
import { Base } from './index';

const fetchPackages = async (query = "react") => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(`https://api.npms.io/v/search?q=${query}`);
            response = await response.json();
            resolve(response.results)

        } catch (error) {
            reject(error)
        }
    })
};

export default {
    title: 'Tables/Base',
    component: Base,
};

const Template = (args) => {
    const tableRef = useRef(null);

    const config = {
        filterable: false,
        columns: [
            {
                label: 'Logged In On',
                identifier: 'created_on',
                resolver: (d) => {
                    return d.created_on;
                },
                sortable: false,
                filterable: {
                    type: 'text',
                },
            },
            {
                label: 'Browser',
                identifier: 'browser',
                resolver: (d) => {
                    return d.browser;
                },
                sortable: false,
                filterable: {
                    type: 'text',
                },
            },
            {
                label: 'Last Used',
                identifier: 'last_used_human',
                resolver: (d) => {
                    return d.last_used_human;
                },
                sortable: false,
                filterable: {
                    type: 'text',
                },
            },
            {
                label: '',
                filterable: {
                    type: 'clear',
                },
                actions: true,
                links: [
                    {
                        icon: (item) => {
                            if (item.id === decoded.jti) {
                                return (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Current
                                    </span>
                                );
                            } else {
                                return (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800">
                                        Destroy{' '}
                                        X
                                    </span>
                                );
                            }
                        },
                        resolver: (item) => {
                            alert("confirm delete")
                        },
                        condition: (item) => {
                            return true;
                        },
                    },
                ],
            },
        ],
    };

    return <Base
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
}

export const Basic = Template.bind({});

Basic.args = {

};
