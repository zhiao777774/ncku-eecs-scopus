import React, {Component} from 'react';
import {withRouter} from 'next/router';
import Layout from '@/components/layout';
import SearchTable from '@/components/table';
import Dropdown from '@/components/dropdown';
import {databaseMap, QuerykeyMapping} from '@/constants/formComponents';

class Browse extends Component {
    constructor(props) {
        super(props);

        this.dropdownRef = React.createRef();
        this.filterItem = Object.values(databaseMap);

        this.state = {
            data: props.data,
            openPanel: false,
            filter: databaseMap[props.router.query.ds || 'csie']
        };
    }

    _setSelected = ({target}) => {
        const selected = target.getAttribute('d-val') ||
            target.parentNode.getAttribute('d-val');

        const selectedIndex = this.filterItem.indexOf(selected);
        const dataset = Object.keys(databaseMap)[selectedIndex];

        window.location = `/browse?ds=${dataset}`;

        return selected;
    };

    render() {
        const {openPanel, filter, data} = this.state;

        return (
            <Layout selectedIdx={2} openPanel={openPanel}>
                <div className="mb-44">
                    <div className="flex gap-3">
                        <div className="mt-3 mb-4 text-2xl font-semibold tracking-wide text-gray-700">論文瀏覽</div>
                        <div className="mt-2.5">
                            <Dropdown label=" " items={this.filterItem}
                                      selectedIndex={this.filterItem.indexOf(filter)}
                                      onSelected={this._setSelected}
                                      ref={this.dropdownRef}/>
                        </div>
                    </div>
                    <SearchTable user="undefined" dataset={data}/>
                </div>
            </Layout>
        )
    }
}

export default withRouter(Browse);

export async function getServerSideProps(context) {
    const {req, query} = context;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

    const defaultDs = query.ds || 'csie';
    const result = await fetch(baseUrl + '/api/data?dataset=' + defaultDs);
    const data = await result.json();

    const formatted = data.map((dataset) => {
        return dataset.map((data) => {
            const temp = {};
            Object.keys(data).forEach((item) => {
                const keyMapped = QuerykeyMapping(item.trim());
                if (!keyMapped) return;
                temp[keyMapped] = data[item];
            });
            temp['department'] = databaseMap[defaultDs];

            return temp;
        });
    });

    return {props: {data: formatted.flat()}};
}