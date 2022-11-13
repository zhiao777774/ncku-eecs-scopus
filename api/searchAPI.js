import csieCSV from 'data/scopus/電資學院近三年出版-資訊領域(含醫資).csv';
import imeCSV from 'data/scopus/電資學院近三年出版-微電子領域(含奈米).csv';
import eeCSV from 'data/scopus/電資學院近三年出版-電機領域.csv';
import cceCSV from 'data/scopus/電資學院近三年出版-電通領域.csv';
import imisCSV from 'data/scopus/電資學院近三年出版-製造領域.csv';
import {conditionTypeMap} from '@/constants/formComponents';
import Filter from '@/utils/filter';


const dataset = {
    csie: csieCSV,
    ime: imeCSV,
    ee: eeCSV,
    cce: cceCSV,
    imis: imisCSV
};

function dbFilter(database) {
    return Object.keys(database)
        .filter((item) => database[item])
        .map((item) => dataset[item]);
}

/*
queryData format example:
{
  keyword: 'computer',
  searchField: { ku: true, au: true, kw: true, ab: true, pb: true },
  searchMode: '精準',
  documentType: { article: true, review: true, 'conference-paper': true },
  stage: { Final: true, 'in-press': true },
  database: { csie: true, ime: true, ee: true, cce: true, imis: true }
}
*/
export function baseSearch(queryData) {
    const {database, keyword, searchField, searchMode, documentType, stage} = queryData;
    const filter = new Filter(searchMode, {
        keyword, searchField, documentType, stage
    });

    return dbFilter(database)
        .map(((csv) => csv.filter((rowData) => filter.process(rowData))));
}

/*
queryData format example:
{
  keyword: [
    { text: 'computer', type: 'all' },
    { text: 'computer', type: 'kw', operator: 'and' }
  ],
  searchMode: '精準',
  documentType: { article: true, review: true, 'conference-paper': true },
  stage: { Final: true, 'in-press': true },
  database: { csie: true, ime: true, ee: true, cce: true, imis: true }
}
*/
export function advanceSearch(queryData) {
    const {database, keyword, searchMode, documentType, stage} = queryData;
    const datasetsDBFiltered = dbFilter(database);
    let datasets = [];

    function _processSearchField(type) {
        let searchField = {};
        if (type === 'all') {
            Object.values(conditionTypeMap).forEach((type) => {
                searchField[type] = true;
            });
        } else {
            searchField = {[type]: true};
        }

        return searchField;
    }

    // first condition & "OR" condition
    keyword.filter(({operator}) => !operator || operator === 'or')
        .forEach(({text, type}) => {
            const searchField = _processSearchField(type);
            const filter = new Filter(searchMode, {
                keyword: text, searchField, documentType, stage
            });

            const tempDS = datasetsDBFiltered.map(((csv) => csv.filter((rowData) => filter.process(rowData))));
            tempDS.forEach((ds, i) => {
                datasets[i] = datasets[i] || [];
                // remove duplicate data (because data format is "object", cannot use pure "Set" to processed)
                datasets[i] = [...new Set([...datasets[i], ...ds].map(JSON.stringify))].map(JSON.parse);
            });
        });

    // "AND" & "NOT" condition
    keyword.filter(({operator}) => operator && (operator === 'and' || operator === 'not'))
        .forEach(({text, type, operator}) => {
            const searchField = _processSearchField(type);
            const filter = new Filter(searchMode, {
                keyword: text, searchField, documentType, stage
            });

            datasets = datasets.map((csv) =>
                (csv.filter((rowData) => {
                    if (operator === 'and')
                        return filter.process(rowData);
                    else if (operator === 'not')
                        return !filter.process(rowData);
                }))
            );
        });

    return datasets;
}

export function searchById(idList) {
    return Object.values(dataset).map((csv) => {
        const result = [];
        idList.forEach(({EID, DOI}) => {
            const matched = csv.filter((rowData) => rowData.EID === EID && rowData.DOI === DOI);
            if (matched.length) result.push(matched[0]);
        });

        return result;
    });
}