import nextConnect from 'next-connect';
import {baseSearch, advanceSearch} from '@/api/searchAPI';

const handler = nextConnect();

handler.get(async (req, res) => {
    const defaultQuery = {
        keyword: ' ',
        searchField: {ku: true, au: true, kw: true, ab: true, pb: true},
        searchMode: '精準',
        documentType: {article: true, review: true, 'conference-paper': true},
        stage: {Final: true, 'in-press': true},
        database: {csie: true, ime: true, ee: true, cce: true, imis: true}
    };

    const {dataset = undefined} = req.query;
    if (dataset) {
        Object.keys(defaultQuery.database).forEach((ds) => {
            if (ds !== dataset) defaultQuery.database[ds] = false
        });
    }

    const result = baseSearch(defaultQuery);
    res.json(result);
});

handler.post(async (req, res) => {
    const {searchType, ...queryData} = req.body;

    if (searchType === 'base' || searchType === 'advance') {
        const result = (searchType === 'base') ?
            baseSearch(queryData) : advanceSearch(queryData);
        res.json(result);
    } else {
        res.status(403).end();
    }
});

export default handler;