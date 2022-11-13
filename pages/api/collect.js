import nextConnect from 'next-connect';
import {searchById} from '@/api/searchAPI';

const handler = nextConnect();

handler.post(async (req, res) => {
    const {watchList} = req.body;

    const result = searchById(watchList.map((id) => {
        const [EID, DOI] = id.split('@');
        return {EID, DOI};
    }));

    res.json(result);
});

export default handler;