import {Component} from 'react';
import Layout from '@/components/layout';
import {baseFormCMPT, databaseMap, QuerykeyMapping} from '@/constants/formComponents';
import SearchTable from '@/components/table';

export default class BasicSearcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openPanel: false,
            disabled: false,
            queryResult: null
        };
        this._search = this._search.bind(this);
    }

    async _search(event) {
        event.preventDefault();

        const {target} = event;
        if (!target.keyword.value.replace(/ /g, '')) {
            alert('請輸入檢索詞');
            return;
        }

        const postData = {
            keyword: target.keyword.value,
            searchType: 'base'
        };

        baseFormCMPT.forEach(({componentName, inputType, elements}) => {
            if (inputType === 'checkbox') {
                postData[componentName] = {};
                const component = Array.from(target[componentName]);
                const isAllUnchecked = component.every(({checked}) => checked === false);

                if (isAllUnchecked) {
                    const elementNames = elements.map(({elementName}) => elementName);
                    postData[componentName] = Object.fromEntries(new Map(
                        elementNames.map((item) => [item, true])
                    ));
                } else {
                    elements.forEach(({elementName}, i) => {
                        postData[componentName][elementName] = component[i].checked;
                    });
                }
            } else if (inputType === 'radio') {
                postData[componentName] = target[componentName].value;
            }
        });

        this.setState({disabled: true, queryResult: null});
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postData)
        });
        const result = await res.json();

        if (!!result) {
            const db = Object.keys(postData.database).filter((db) => postData.database[db]);
            const dbMap = Object.keys(databaseMap)
                .filter((dbName) => db.includes(dbName))
                .map(((dbName) => databaseMap[dbName]));
            const queryResult = result.map((dataset, i) => {
                return dataset.map((data) => {
                    const temp = {};
                    Object.keys(data).forEach((item) => {
                        const keyMapped = QuerykeyMapping(item);
                        if (!keyMapped) return;
                        temp[keyMapped] = data[item];
                    });
                    temp['department'] = dbMap[i];

                    return temp;
                });
            });
            this.setState({disabled: false, queryResult}, () => {
                document.getElementById('retr-div')
                    .scrollIntoView({behavior: 'smooth'});
            });
        } else {
            alert('查詢失敗，請稍後再試');
            this.setState({disabled: false});
        }
    }

    render() {
        const {openPanel, disabled, queryResult} = this.state;

        return (
            <Layout selectedIdx={0} openPanel={openPanel}>
                <form onSubmit={this._search}>
                    <div className="items-center mb-4">
                        <input type="text" name="keyword"
                               className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-11/12 rounded-md sm:text-sm focus:ring-1"
                               required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <button type="submit"
                                className={'btn font-medium ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary')}
                                disabled={disabled}>
                            {disabled ? '搜尋中' : '搜尋'}
                        </button>
                    </div>
                    <div className="flex-col flex flex-wrap">
                        {
                            baseFormCMPT.map(({
                                                  fieldName,
                                                  componentName,
                                                  inputType = 'text',
                                                  placeholder = '',
                                                  defaultChecked = '',
                                                  elements
                                              }) => {
                                return (
                                    <div key={`form-component-${componentName}`} className="flex-auto mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2"
                                               htmlFor={componentName}>
                                            {fieldName}
                                        </label>
                                        {
                                            elements.map(({elementTitle, elementName}, i) =>
                                                <label key={`form-${componentName}-${elementName}`}
                                                       className={`inline-flex items-center ${i ? 'ml-6' : ''}`}>
                                                    <input type={inputType} id={elementName} name={componentName}
                                                           value={elementTitle}
                                                           className={`form-${inputType} text-indigo-600 border border-gray-400`}
                                                           defaultChecked={defaultChecked === elementName}
                                                           required={inputType !== 'checkbox'}/>
                                                    <label htmlFor={elementName}
                                                           className="ml-2">{elementTitle}</label>
                                                </label>
                                            )
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </form>
                <div id="retr-div">
                    {
                        queryResult ?
                            <div className="mb-44">
                                <hr className="border-gray-700 my-6"/>
                                <div className="mt-3 mb-4 text-2xl font-semibold tracking-wide text-gray-700">檢索結果</div>
                                <SearchTable user="undefined" dataset={queryResult.flat()}/>
                            </div>
                            : null
                    }
                </div>
            </Layout>
        )
    }
}