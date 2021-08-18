import { postDataToWebhook } from './../../utils/utils';
import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Movie, { MovieType } from '../../models/movie';
import dbConnect from '../../utils/dbConnect';
import { MovieEndpointBodyType } from '../../types/APITypes';

const MovieAPI = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  if (req.method === `POST`) {
    const { id: movieID }: MovieEndpointBodyType = JSON.parse(req.body);
    try {
      const session = await getSession({ req });
      if (!session?.user?.isAdmin) {
        return res
          .status(401)
          .json({ message: `You are not authorized to do that :(` });
      }

      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.MOVIE_API_KEY}&language=en-US`
      );

      const  movieData  = await movieResponse.json()

      if (movieResponse.status !== 200 || movieData.status_code) {
        return res.status(movieResponse.status);
      }

      const existingMovie = await Movie.findOne({ movieID });
      if (existingMovie) {
        return res.status(400).send({ message: `Movie already exists!` });
      }

      const genres: string[] = movieData?.genres?.map(
        (genre: { name: string }) => {
          return genre.name;
        }
      );

      const newMovie: MovieType = new Movie({
        name: movieData.title || movieData.original_title, //select english title if it exists.
        movieID,
        releaseDate: movieData.release_date,
        revenue: movieData.revenue,
        budget: movieData.budget,
        originalLanguage: movieData.original_language,
        runtime: movieData.runtime,
        voteAverage: movieData.vote_average,
        voteCount: movieData.vote_count,
        imdbID: movieData.imdb_id,
        genres: [...genres],
        image: `https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`,
        description: movieData.overview,
        tagLine: movieData.tagline,
        rating: 0,
        numReviews: 0,
        reviews: [],
      });
      await newMovie.save();

      await postDataToWebhook({
        movie: newMovie,
        type: 'movie',
        action: 'added',
      });

      return res.status(200).send({ data: newMovie, type: `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `GET`) {
    try {
      const movies = await Movie.find({}).populate(
        `reviews.user`,
        `username discord_id image discriminator`
      );

      return res.status(200).send({ data: movies });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    const { id } = JSON.parse(req.body);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const session = await getSession({ req });
    if (!session?.user?.isAdmin) {
      return res
        .status(401)
        .json({ message: `You are not authorized to do that :(` });
    }

    const movie = await Movie.findOne({ _id: id });
    if (!movie) {
      return res.status(404);
    }
    const deletedMovie = await Movie.deleteOne({ _id: id });
    if (deletedMovie.ok === 1) {
      await postDataToWebhook({
        movie: movie,
        type: 'movie',
        action: 'deleted',
      });
      return res.status(200).json(movie);
    }

    return res.status(500);
  } else {
    return res.status(405).json({ message: `method not allowed` });
  }
};

export default MovieAPI;
