import React, {Component} from 'react';
import {withRouter} from 'next/router';
import Dropdown from '@/components/dropdown';
import {DataTabPanel, HistoricalTabPanel} from '@/components/tabPanel';
import {numberRange} from '@/utils/range';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faBook,
    faChevronLeft,
    faChevronRight,
    faClockRotateLeft,
    faSortDown,
    faSortUp,
    faStar as faSolidStar
} from '@fortawesome/free-solid-svg-icons';
import {faStar as faHollowStar} from '@fortawesome/free-regular-svg-icons';
import {setCookie, getCookie, hasCookie} from 'cookies-next';


class SearchTable extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.dataset;
        this.dataSize = this.data.length;
        this.dropdownRef = React.createRef();
        this.tabData = [
            {
                mode: 'data',
                title: '論文資料',
                icon: faBook
            },
            {
                mode: 'history',
                title: '瀏覽紀錄',
                icon: faClockRotateLeft
            }
        ];

        this.state = {
            start: 0,
            end: 100 <= this.dataSize ? 99 : this.dataSize - 1,
            pageSize: 100,
            page: 1,
            selected: 100,
            orderby: '年份',
            asc: false,
            watchList: hasCookie('watchList') ? JSON.parse(getCookie('watchList')) : [],
            openPanel: false,
            datasetInfo: undefined,
            history: /*hasCookie('historicalData') ? JSON.parse(getCookie('historicalData')) :*/ [], //TODO: cookie設定
            mode: 'data'
        };

        this._loadDataAndSaveToHistory = this._loadDataAndSaveToHistory.bind(this);
    }

    _loadDataAndSaveToHistory(data) {
        const {history} = this.state;
        const idxExist = history.findIndex(({EID}) => EID === data.EID);
        const tempArray = (idxExist >= 0) ?
            JSON.parse(JSON.stringify(history)) :
            history.concat([data]);

        if (idxExist >= 0)
            tempArray.push(tempArray.splice(idxExist, 1)[0]);
        if (tempArray.length > 10) tempArray.shift();

        setCookie(
            'historicalData',
            JSON.stringify(tempArray.map(({DOI}) => DOI)),
            {maxAge: 7 * 24 * 60 * 60}
        );

        this.setState({
            openPanel: true,
            datasetInfo: data,
            history: tempArray,
            mode: 'data'
        });
    }

    _setSelected = ({target}) => {
        const selected = target.getAttribute('d-val') ||
            target.parentNode.getAttribute('d-val');
        const pageSize = Number(selected);

        if (this.state.selected !== selected) {
            this.setState({
                start: 0,
                end: pageSize <= this.dataSize ? pageSize - 1 : this.dataSize - 1,
                pageSize,
                page: 1
            });
        }

        return selected;
    };

    _switchPage = ({target}) => {
        const event = target.getAttribute('d-event') ||
            target.parentNode.getAttribute('d-event');
        const {start, end, pageSize, page} = this.state;

        if (event === 'next' && start + pageSize <= this.dataSize) {
            this.setState({
                start: start + pageSize,
                end: end + pageSize > this.dataSize ? this.dataSize - 1 : end + pageSize,
                page: page + 1
            });
        } else if (event === 'prev' && start - pageSize >= 0) {
            this.setState({
                start: start - pageSize,
                end: start - 1,
                page: page - 1
            });
        }
    };

    _changePage = ({target}) => {
        const page = Number(target.innerText);

        if (page !== this.state.page) {
            const {pageSize} = this.state;
            this.setState({
                start: page * pageSize - pageSize,
                end: page * pageSize - 1 > this.dataSize ? this.dataSize - 1 : page * pageSize - 1,
                page
            });
        }
    };

    _sort = ({target}) => {
        const orderby = target.getAttribute('d-val') ||
            target.parentNode.getAttribute('d-val') ||
            target.parentNode.parentNode.getAttribute('d-val');
        this.setState({
            orderby,
            asc: !this.state.asc
        });
    };

    _collect = ({target}) => {
        /*if (this.props.user === 'undefined') {
            alert('請先登入');
            this.props.router.push('/login');
            return;
        }*/

        const code = target.getAttribute('d-code') ||
            target.parentNode.getAttribute('d-code');
        let newWatchList = this.state.watchList;

        if (newWatchList.includes(code))
            newWatchList = newWatchList.filter((e) => e !== code);
        else {
            if (newWatchList.length >= 30) {
                alert('最多只能收藏 30 篇論文');
                return;
            }
            newWatchList.push(code);
        }

        this.setState({watchList: newWatchList});
        setCookie('watchList', JSON.stringify(newWatchList), {
            maxAge: 7 * 24 * 60 * 60
        });

        /*fetch('/api/collect', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                condition: {
                    account: this.props.user.account
                },
                update: {watchList: newWatchList}
            })
        });*/
    };

    render() {
        const {start, end, pageSize, page, selected, orderby, asc} = this.state;
        const {watchList, openPanel, datasetInfo, history, mode} = this.state;
        const pageSizes = [100, 50, 20];
        const pageable = this.dataSize / pageSize > 1;
        const lastPageNumber = Math.ceil(this.dataSize / pageSize);

        const data = this.data.slice(start, end + 1);
        data.sort((item1, item2) => {
            switch (orderby) {
                case '年份':
                    return (item1.year - item2.year) * (asc ? 1 : -1);
                case '標題':
                    const [n1, n2] = [item1.title.toUpperCase(), item2.title.toUpperCase()];
                    return (n1 < n2 ? -1 : 1) * (asc ? 1 : -1);
                case '作者':
                    const [o1, o2] = [item1.author.toUpperCase(), item2.author.toUpperCase()];
                    return (o1 < o2 ? -1 : 1) * (asc ? 1 : -1);
                case '領域':
                    const [d1, d2] = [item1.department.toUpperCase(), item2.department.toUpperCase()];
                    return (d1 < d2 ? -1 : 1) * (asc ? 1 : -1);
                case '被引用次數':
                    return (item1.cited - item2.cited) * (asc ? 1 : -1);
                default:
                    break;
            }
        });

        return (
            <div>
                <table className="min-w-full bg-white relative">
                    <thead>
                    <tr className="sticky top-0 z-40 text-xs border-b border-gray-100 tracking-wider text-black bg-gray-200">
                        <th className="sticky top-0 z-40 p-3 pl-7 pr-6 text-left"></th>
                        <th className="sticky top-0 z-40 p-3 text-left leading-4 cursor-pointer"
                            d-val="年份" onClick={this._sort}>
                            年份
                            {
                                orderby === '年份' ?
                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg"
                                                     className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')}
                                                     onClick={this._sort}/> :
                                    null
                            }
                        </th>
                        <th className="sticky top-0 z-40 p-3 text-left leading-4 cursor-pointer"
                            d-val="標題" onClick={this._sort}>
                            標題
                            {
                                orderby === '標題' ?
                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg"
                                                     className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')}
                                                     onClick={this._sort}/> :
                                    null
                            }
                        </th>
                        <th className="sticky top-0 z-40 p-3 text-left leading-4 cursor-pointer"
                            d-val="作者" onClick={this._sort}>
                            作者
                            {
                                orderby === '作者' ?
                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg"
                                                     className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')}
                                                     onClick={this._sort}/> :
                                    null
                            }
                        </th>
                        <th className="sticky top-0 z-40 p-3 text-center leading-4 cursor-pointer"
                            d-val="領域" onClick={this._sort}>
                            領域
                            {
                                orderby === '領域' ?
                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg"
                                                     className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')}
                                                     onClick={this._sort}/> :
                                    null
                            }
                        </th>
                        <th className="sticky top-0 z-40 p-3 pr-9 text-right leading-4 cursor-pointer"
                            d-val="被引用次數" onClick={this._sort}>
                            被引用次數
                            {
                                orderby === '被引用次數' ?
                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg"
                                                     className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')}
                                                     onClick={this._sort}/> :
                                    null
                            }
                        </th>
                    </tr>
                    </thead>
                    <tbody className="font-semibold text-sm">
                    {
                        data.map(((datasetInfo, idx) => {
                            const {EID, DOI, year, title, author, cited, department} = datasetInfo;
                            const id = `${EID}@${DOI}`;

                            return (
                                <tr key={`${id}-${idx}`}
                                    className={'hover:bg-blue-100 border-b ' + ((idx % 2) ? 'bg-gray-50' : 'bg-white')}>
                                    <td className="h-20 p-3 pl-7 pr-6 text-gray-400 text-left">
                                        <FontAwesomeIcon icon={watchList.includes(id) ? faSolidStar : faHollowStar}
                                                         size="sm"
                                                         className={'cursor-pointer ' + (watchList.includes(id) ? 'text-yellow-400' : 'hover:text-yellow-400')}
                                                         d-code={id} onClick={this._collect}/>
                                    </td>
                                    <td className="p-3 whitespace-no-wrap text-left">
                                        <div className="flex items-center">
                                            <div className="leading-5 text-gray-900 w-14">{year}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 whitespace-no-wrap text-left cursor-pointer"
                                        onClick={() => this._loadDataAndSaveToHistory(datasetInfo)}
                                    >
                                        <div className="flex items-center">
                                            <div className="leading-5 text-blue-900">{title}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 whitespace-no-wrap text-left">
                                        <div className="flex items-center">
                                            <div className="leading-5 text-gray-700">
                                                {
                                                    author.split(',').map((name) =>
                                                        <span key={`author-${name}-${id}-${Math.random()}`}
                                                              className="inline-block p-1 px-2 mr-2 mb-2 rounded-full bg-gray-100">{name.trim()}</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 whitespace-no-wrap text-center w-56">
                                        <span
                                            className="inline-block p-2 px-3 mb-2 rounded-full bg-green-100 bg-opacity-80 font-normal">{department}</span>
                                    </td>
                                    <td className="p-3 pr-9 whitespace-no-wrap text-right w-32">{cited}</td>
                                </tr>
                            );
                        }))
                    }
                    </tbody>
                </table>
                <div className="mt-6 font-bold text-sm relative">
                    <span className="absolute top-0 left-3">顯示 {this.dataSize} 中的 {start + 1}-{end + 1}</span>
                    <span className="absolute position-center">
                            <FontAwesomeIcon icon={faChevronLeft} size='lg'
                                             className="text-gray-700 mr-5 cursor-pointer"
                                             style={{display: pageable ? '' : 'none'}} d-event="prev"
                                             onClick={pageable ? this._switchPage : undefined}/>
                            <button
                                className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (page === 1 ? '' : 'bg-white hover:bg-gray-100 text-black')}
                                onClick={this._changePage}>1</button>
                        {
                            page - 3 > 1 ?
                                <button className="btn text-black rounded-lg px-3 py-2 mr-3">...</button> :
                                null
                        }
                        {
                            numberRange(page - 3 >= 2 ? 3 + page - 5 : 2, page <= 3 ? 7 : 7 + page - 4).map((i) => {
                                if (i !== 1 && i >= lastPageNumber) return null;
                                return <button key={`page-${i}`}
                                               className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (i === page ? '' : 'bg-white hover:bg-gray-100 text-black')}
                                               onClick={this._changePage}>{i}</button>;
                            })
                        }
                        {
                            this.dataSize / pageSize > page + 3 ?
                                <button className="btn text-black rounded-lg px-3 py-2 mr-3">...</button> :
                                null
                        }
                        {
                            lastPageNumber !== 1 ?
                                <button
                                    className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (lastPageNumber === page ? '' : 'bg-white hover:bg-gray-100 text-black')}
                                    onClick={this._changePage}>{lastPageNumber}</button> :
                                null
                        }
                        <FontAwesomeIcon icon={faChevronRight} size='lg' className="text-gray-700 ml-2 cursor-pointer"
                                         style={{display: pageable ? '' : 'none'}} d-event="next"
                                         onClick={pageable ? this._switchPage : undefined}/>
                        </span>
                    <span className="absolute -top-1.5 right-3">
                            <Dropdown label="每頁顯示" items={pageSizes}
                                      selectedIndex={pageSizes.indexOf(selected)}
                                      onSelected={this._setSelected} ref={this.dropdownRef}/>
                        </span>
                </div>
                <div
                    className="bg-gray-50 fixed bottom-0 -right-2 z-50 border-gray-700 border-l border-t rounded-tl-3xl"
                    style={{width: openPanel ? '30rem' : '0', height: '45rem', transition: 'width 500ms'}}>
                    <div className="border-b p-6 pr-8 w-full font-medium text-gray-800 relative">
                        <FontAwesomeIcon icon={faChevronRight} size="xl" className="cursor-pointer hover:text-black"
                                         onClick={() => this.setState({openPanel: false})}/>
                        <div className={'text-sm flex gap-x-2 bottom-0 right-9 ' + (openPanel ? 'absolute' : 'fixed')}>
                            {
                                this.tabData.map((tab) => (
                                    <div key={`tab-${tab.mode}`}
                                         className={'cursor-pointer bg-gray-100 hover:text-black hover:bg-gray-200 rounded-t-xl py-2 px-3 '
                                             + (openPanel && mode === tab.mode ? 'border-b-2 border-blue-800 shadow' : 'border border-b-0 border-gray-200')}
                                         onClick={() => this.setState({mode: tab.mode, openPanel: true})}>
                                        <FontAwesomeIcon icon={tab.icon} size="lg" className="mr-2"/>
                                        <span>{tab.title}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="p-6 h-full overflow-y-auto">
                        {
                            openPanel && datasetInfo ?
                                (
                                    mode === 'data' ? <DataTabPanel data={datasetInfo}/>
                                        : <HistoricalTabPanel data={history}
                                                              loadDataEvent={this._loadDataAndSaveToHistory}/>
                                )
                                : (!datasetInfo ? <div className="font-bold text-red-600 text-lg">尚未有瀏覽紀錄</div> : null)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchTable);