import React, {Component} from 'react';
import Layout from '@/components/layout';
import {
    advanceFormCMPT, databaseMap, conditionType,
    conditionOperator, QuerykeyMapping, CondTypeMapping
} from '@/constants/formComponents';
import SearchTable from '@/components/table';
import Dropdown from '@/components/dropdown';
import Tooltip from '@/components/tooltip';

export default class AdvanceSearcher extends Component {
    constructor(props) {
        super(props);

        this.inputCondDDL = Array(advanceFormCMPT[0].length);
        for (let i = 0; i < this.inputCondDDL.length; i++) {
            this.inputCondDDL[i] = {
                ref: {
                    type: React.createRef(),
                    operator: React.createRef()
                },
                selected: {
                    type: 0,
                    operator: i ? 0 : null
                }
            };
        }

        this.state = {
            inputCmpts: advanceFormCMPT[0],
            openPanel: false,
            disabled: false,
            queryResult: null
        };
        this._search = this._search.bind(this);
    }

    _setSelected = (target, condIndex, dropdownName) => {
        const selected = target.getAttribute('d-val') ||
            target.parentNode.getAttribute('d-val');

        this.inputCondDDL[condIndex].selected[dropdownName] = {
            'type': conditionType,
            'operator': conditionOperator
        }[dropdownName].indexOf(selected);

        return selected;
    };

    async _search(event) {
        event.preventDefault();

        const {target} = event;
        if (!target['keyword-1'].value.replace(/ /g, '')) {
            alert('請輸入檢索詞');
            return;
        }

        const keyword = [];
        this.state.inputCmpts.forEach(({componentName}, i) => {
            const text = target[componentName].value;
            if (text) {
                const {type, operator} = this.inputCondDDL[i].selected;
                keyword.push({
                    text,
                    type: CondTypeMapping(conditionType[type]),
                    operator: conditionOperator[operator]
                });
            }
        });

        const postData = {
            keyword,
            searchType: 'advance'
        };

        advanceFormCMPT.slice(1).forEach(({componentName, inputType, elements}) => {
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
        const {inputCmpts, openPanel, disabled, queryResult} = this.state;

        return (
            <Layout selectedIdx={1} openPanel={openPanel}>
                <form onSubmit={this._search}>
                    {
                        inputCmpts.map(({fieldName, componentName}, i) => {
                            const {ref, selected} = this.inputCondDDL[i];
                            return (
                                <div key={`form-component-${componentName}`} className="flex-auto mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2"
                                           htmlFor={componentName}>
                                        {fieldName}
                                        {
                                            !i ? <Tooltip type="sf" /> : null
                                        }
                                    </label>
                                    <div className="flex gap-3 w-full">
                                        {
                                            i ?
                                                <Dropdown label=" " items={conditionOperator}
                                                          selectedIndex={selected.operator}
                                                          onSelected={({target}) => this._setSelected(target, i, 'operator')}
                                                          ref={ref.operator}/>
                                                : null
                                        }
                                        <input
                                            onChange={({target}) => this.setState({[componentName]: target.value})}
                                            className={(i ? 'w-2/3' : 'w-3/4 ml-2') + ' py-2 px-3 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
                                            name={componentName} id={componentName} type="text" required={i === 0}/>
                                        <Dropdown label=" " items={conditionType}
                                                  selectedIndex={selected.type}
                                                  onSelected={({target}) => this._setSelected(target, i, 'type')}
                                                  ref={ref.type}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                    <div className="flex items-center justify-left gap-3 mb-6">
                        <button type="submit"
                                className={'btn font-medium ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary')}
                                disabled={disabled}>
                            {disabled ? '搜尋中' : '搜尋'}
                        </button>
                        <button type="button"
                                className={'btn font-medium ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-success')}
                                onClick={() => {
                                    const n = inputCmpts.length + 1;
                                    this.inputCondDDL.push({
                                        ref: {
                                            type: React.createRef(),
                                            operator: React.createRef()
                                        },
                                        selected: {
                                            type: 0,
                                            operator: 0
                                        }
                                    });
                                    this.setState({
                                        inputCmpts: inputCmpts.concat([{
                                            fieldName: `條件${n}`, componentName: `condition-${n}`
                                        }])
                                    });
                                }}
                                disabled={disabled}>
                            新增條件
                        </button>
                        <button type="button"
                                className={'btn font-medium ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-danger')}
                                onClick={() => {
                                    if (this.inputCondDDL.length > 3) {
                                        this.inputCondDDL.pop();
                                        inputCmpts.pop()
                                        this.setState({inputCmpts});
                                    } else {
                                        alert('最少要有三個條件欄位存在');
                                    }
                                }}
                                disabled={disabled}>
                            移除條件
                        </button>
                    </div>
                    <div className="flex-col flex flex-wrap">
                        {
                            advanceFormCMPT.slice(1).map(({
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