import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen, faEnvelope, faGraduationCap, faUserAlt} from "@fortawesome/free-solid-svg-icons";

export function DataTabPanel(props) {
    const {data} = props;

    return (
        <div className="pb-6 overflow-auto">
            <div className="font-bold text-lg">{data.title}</div>
            <div className="mt-6 w-full">
                                         <span
                                             className="text-sm inline-block p-1 px-3 mr-1 mb-2 rounded-full bg-green-100">{data.publication}</span>
                <span
                    className="text-sm inline-block p-1 px-3 mr-1 mb-2 rounded-full bg-green-100">{data.year}</span>
            </div>
            <div className="mt-2">
                {
                    data.author.split(',').map((name) =>
                        <span key={`author-${name}`}
                              className="text-sm inline-block p-1 px-3 mr-1 mb-2 rounded-full bg-blue-100">{name.trim()}</span>
                    )
                }
            </div>
            {
                data.comm ?
                    (
                        <div className="mt-4">
                            通訊作者資訊：
                            <br/>
                            <table className="w-full text-sm text-left text-gray-800 mt-2">
                                <tbody>
                                {
                                    data.comm.split(';').map((s, i) => {
                                        return (
                                            <tr key={`comm-tr-${i}`} className="border-b">
                                                <th scope="row"
                                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                                    <FontAwesomeIcon
                                                        icon={[faUserAlt, faGraduationCap, faEnvelope][i]}
                                                        className="mr-2"/>
                                                    {['作者名稱', '所屬系所', '電子郵件'][i]}
                                                </th>
                                                <td className="py-4 px-6">{s.replace('電子郵件:', '')}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    ) : null
            }
            <div className="mt-4">
                文獻類型：{data.type}
            </div>
            <div className="mt-4">
                DOI：{data.DOI}
            </div>
            <div className="mt-4 text-blue-900 font-medium hover:text-blue-600">
                <FontAwesomeIcon icon={faBookOpen} className="mr-2"/>
                <a href={data.link} target="_blank" rel="noreferrer">詳細資訊</a>
            </div>
        </div>
    );
}

export function HistoricalTabPanel(props) {
    const {data, loadDataEvent} = props;
    return (
        <div className="pb-28 overflow-auto">
            <div className="font-semibold text-red-700 text-center">最多紀錄 10 筆資料</div>
            <table className="w-full text-sm font-semibold text-gray-800 mt-2">
                <tbody>
                {
                    [...data].reverse().map((item, i) =>
                        <tr key={`history-tr-${i}`} className="border-b cursor-pointer hover:bg-gray-200"
                            onClick={() => loadDataEvent(item)}>
                            <td className="py-4 px-4">{item.title}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    );
}