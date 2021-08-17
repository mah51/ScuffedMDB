import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Movie from '../../../models/movie';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  try {
    const { isLean, id } = req.query;

    const movie: any = isLean
      ? await Movie.findById(id)
          .populate(`reviews.user`, `username discord_id image discriminator`)
          .lean()
      : await Movie.findById(id).populate(
          `reviews.user`,
          `username discord_id image discriminator`
        );

    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json({ error: 'Could not find movie' });
  }
};

export default handler;
