import { NextApiRequest, NextApiResponse } from 'next';
import { useAPIAuth } from '../../utils/useAPIAuth';
import dbConnect from '../../utils/dbConnect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const discUser = await useAPIAuth(req, res, process.env.JWT_CODE);
    try {
        if (!discUser) {
            return res.status(401);
        }
        const { search } = req.query;

        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`,
        );
        const data = await response.json();
        return res.status(200).send(data);
    } catch (err) {
        return res.status(500).send(err);
    }
};
