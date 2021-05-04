import { NextApiRequest, NextApiResponse } from 'next';
import { useAPIAuth } from '../../utils/useAPIAuth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const discUser = await useAPIAuth(req, res, process.env.JWT_CODE);
  if (!discUser) {
    return res.status(401);
  }
  const { search } = req.query;

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`,
  );
  const data = await response.json();
  return res.status(response.status).send(data);
};
