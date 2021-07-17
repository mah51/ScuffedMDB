import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dbConnect from '../../utils/dbConnect';

export interface OMDBMovie {
  poster_path?: string | null;
  adult?: boolean;
  overview?: string;
  release_date?: string;
  genre_ids?: number[];
  id?: number;
  original_title?: string;
  title?: string;
  backdrop_path?: string | null;
  popularity?: number;
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
}
export interface OMDBResponse {
  page?: number;
  total_results?: number;
  total_pages?: number;
  results: OMDBMovie[];
  status_message?: string;
  status_code?: number;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const session = await getSession({ req });
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ message: `You are not authorized to do that :(` });
  }
  try {
    const { search } = req.query;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${search}&page=1&include_adult=false`
    );
    const data: OMDBResponse = await response.json();
    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
};

export default handler;
