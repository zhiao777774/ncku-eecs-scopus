class SearchMode {
    constructor({searchField, keyword, documentType, stage}) {
        this._field = searchField;
        this._kw = keyword;
        this._dt = documentType;
        this._stage = stage;
    }

    process(rowData) {
        throw new Error('Method "process()" must be implemented.');
    }

    _replaceKeys(object) {
        Object.keys(object).forEach((key) => {
            var newKey = key.replace(/\s+/g, '');
            if (object[key] && typeof object[key] === 'object') {
                this._replaceKeys(object[key]);
            }
            if (key !== newKey) {
                object[newKey] = object[key];
                delete object[key];
            }
        });
    }

    _preprocess(content, sep = undefined) {
        if (Array.isArray(content)) {
            if (sep !== undefined && sep !== null)
                return content.map((item) => item.toLowerCase().split(sep)).flat();
            return content.map((s) => s.toLowerCase().trim());
        } else if (typeof content === 'string') {
            if (sep !== undefined && sep !== null)
                return content.split(sep).map((s) => s.toLowerCase().trim());
            return content.toLowerCase();
        }
    }
}

class ExactMode extends SearchMode {
    process(rowData) {
        const field = this._field;
        const keyword = this._kw.toLowerCase().trim();
        const pp = this._preprocess;

        this._replaceKeys(rowData);
        const {'標題': ku, 作者: au, 索引關鍵字: kw, 摘要: ab, 來源出版物名稱: pb, 年份: year} = rowData;

        let flag = (field.kw && kw && pp(kw, '; ').includes(keyword)) || // 關鍵字
            (field.ku && pp(ku).includes(keyword)) || // 標題
            (field.au && au && (
                pp(au, ',').includes(keyword) || // 作者全名
                pp(pp(au, ','), ' ').includes(keyword) // 作者姓或名
            )) ||
            (field.ab && ab && pp(ab).includes(keyword)) || // 摘要
            (field.pb && pb && pp(pb).includes(keyword)) || // 出版刊物
            (field.year && year && (String(year) === String(keyword))); // 年份

        if (!flag) return false;

        if (!Object.values(this._dt).every((item) => item)) {
            flag = Object.keys(this._dt).filter((type) => this._dt[type])
                .map((type) => type.replace('-', ' '))
                .includes(rowData['文獻類型'].toLowerCase());

            if (!flag) return false;
        }

        if (!Object.values(this._stage).every((item) => item)) {
            flag = Object.keys(this._stage).filter((stage) => this._stage[stage])
                .map((stage) => stage.replace('-', ' '))
                .includes(rowData['出版階段'].toLowerCase());

            if (!flag) return false;
        }

        return true;
    }
}

class FuzzyMode extends SearchMode {
    process() {

    }
}

class HomophoneMode extends SearchMode {
    process() {

    }
}

class SynonymMode extends SearchMode {
    process() {

    }
}

export default class Filter {
    constructor(mode, condition) {
        this._processor = this._getFilter(mode, condition);
    }

    _getFilter(mode, condition) {
        switch (mode) {
            case '精準':
            default:
                return new ExactMode(condition);
            case '模糊':
                return new FuzzyMode(condition);
            case '同音':
                return new HomophoneMode(condition);
            case '同義詞':
                return new SynonymMode(condition);
        }
    }

    process(rowData) {
        return this._processor.process(rowData);
    }
}