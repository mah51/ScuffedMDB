import { NextApiRequest, NextApiResponse } from 'next';
import { useAPIAuth } from '../../../utils/useAPIAuth';
import dbConnect from '../../../utils/dbConnect';
import Movie, { MovieType } from '../../../models/movie';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();

  // eslint-disable-next-line react-hooks/rules-of-hooks

  try {
    const { isLean, id } = req.query;

    const movie: any = isLean
      ? await Movie.findById(id).lean()
      : await Movie.findById(id);

    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
