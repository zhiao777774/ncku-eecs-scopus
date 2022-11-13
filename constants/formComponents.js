import {numberRange} from "@/utils/range";

const extraSearchMode = {
    fieldName: '查詢模式',
    componentName: 'searchMode',
    elements: [{
        elementTitle: '精準',
        elementName: 'es-1'
    }, /*{  // TODO: 暫時取消模糊、同音、同義詞模式
        elementTitle: '模糊',
        elementName: 'es-2'
    }, {
        elementTitle: '同音',
        elementName: 'es-3'
    }, {
        elementTitle: '同義詞',
        elementName: 'es-4'
    }*/],
    defaultChecked: 'es-1',
    inputType: 'radio'
};

const documentType = {
    fieldName: '文獻類型',
    componentName: 'documentType',
    elements: [{
        elementTitle: 'Article',
        elementName: 'article'
    }, {
        elementTitle: 'Review',
        elementName: 'review'
    }, {
        elementTitle: 'Conference Paper',
        elementName: 'conference-paper'
    }],
    inputType: 'checkbox'
};

const stage = {
    fieldName: '出版階段',
    componentName: 'stage',
    elements: [{
        elementTitle: 'Final',
        elementName: 'Final'
    }, {
        elementTitle: 'In press',
        elementName: 'in-press'
    }],
    inputType: 'checkbox'
};

const database = {
    fieldName: '查詢資料庫',
    componentName: 'database',
    elements: [{
        elementTitle: '資訊領域（含醫療資訊及人工智慧）',
        elementName: 'csie'
    }, {
        elementTitle: '微電子領域（含奈米）',
        elementName: 'ime'
    }, {
        elementTitle: '電機領域',
        elementName: 'ee'
    }, {
        elementTitle: '電通領域',
        elementName: 'cce'
    }, {
        elementTitle: '製造領域',
        elementName: 'imis'
    }],
    inputType: 'checkbox'
};

const baseFormCMPT = [
    {
        fieldName: '查詢範圍',
        componentName: 'searchField',
        elements: [{
            elementTitle: '論文名稱',
            elementName: 'ku'
        }, {
            elementTitle: '作者',
            elementName: 'au'
        }, {
            elementTitle: '關鍵詞',
            elementName: 'kw'
        }, {
            elementTitle: '摘要',
            elementName: 'ab'
        }, {
            elementTitle: '出版刊物',
            elementName: 'pb'
        }],
        inputType: 'checkbox'
    },
    extraSearchMode,
    documentType,
    stage,
    database
];

const advanceFormCMPT = [
    numberRange(1, 3, true).map((n) => ({
        fieldName: `條件${n}`, componentName: `keyword-${n}`
    })),
    extraSearchMode,
    documentType,
    stage,
    database
];

const conditionTypeMap = {
    '不限欄位': 'all',
    ...Object.fromEntries(baseFormCMPT[0]
        .elements.map((item) => Object.values(item))),
    '論文出版年': 'year'
};
const conditionType = Object.keys(conditionTypeMap);
const conditionOperator = ['and', 'or', 'not'];
const CondTypeMapping = (key) => conditionTypeMap[key];

const keyMap = {
    '作者': 'author',
    '年份': 'year',
    '來源出版物名稱': 'publication',
    '卷': 'vol',
    '期': 'no',
    '論文編號': 'id',
    '起始頁碼': 'startPage',
    '結束頁碼': 'endPage',
    '頁碼計數': 'nPage',
    '被引用文獻': 'cited',
    'DOI': 'DOI',
    '連結': 'link',
    '摘要': 'abstract',
    '索引關鍵字': 'keyword',
    '通訊地址': 'comm',
    '原始文獻語言': 'lang',
    '文獻類型': 'type',
    '出版階段': 'pub',
    'EID': 'EID',
    '標題': 'title'
};
const QuerykeyMapping = (key) => keyMap[key];

const databaseMap = Object.fromEntries(database.elements.map(
    ({elementTitle, elementName}) => [elementName, elementTitle]
));

export {databaseMap};
export {baseFormCMPT, advanceFormCMPT, QuerykeyMapping};
export {conditionType, conditionOperator, conditionTypeMap, CondTypeMapping};