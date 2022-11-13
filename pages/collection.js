import {Component} from 'react';
import Layout from '@/components/layout';
import SearchTable from '@/components/table';
import {databaseMap, QuerykeyMapping} from '@/constants/formComponents';
import * as cookie from 'cookie';

export default class Collection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openPanel: false
        };
    }

    render() {
        const {openPanel} = this.state;

        return (
            <Layout selectedIdx={3} openPanel={openPanel}>
                {
                    this.props.watchList ?
                        <div className="mb-44">
                            <div className="mt-3 mb-4 text-2xl font-semibold tracking-wide text-gray-700">收藏紀錄</div>
                            <SearchTable user="undefined" dataset={this.props.watchList}/>
                        </div>
                        :
                        <div className="font-bold text-red-600 text-lg">無收藏紀錄</div>
                }
            </Layout>
        )
    }
}

export async function getServerSideProps({req, res}) {
    const cookies = cookie.parse((req && req.headers.cookie) || '');

    if (cookies.watchList) {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
        const res = await fetch(baseUrl + '/api/collect', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                watchList: JSON.parse(cookies.watchList)
            })
        });
        const result = await res.json();

        const dbMap = Object.values(databaseMap);
        const queryResult = result.map((dataset, i) => {
            return dataset.map((data) => {
                const temp = {};
                Object.keys(data).forEach((item) => {
                    const keyMapped = QuerykeyMapping(item.trim());
                    if (!keyMapped) return;
                    temp[keyMapped] = data[item];
                });
                temp['department'] = dbMap[i];

                return temp;
            });
        });

        return {
            props: {watchList: queryResult.flat()}
        };
    }

    return {
        props: {watchList: []}
    };
}

