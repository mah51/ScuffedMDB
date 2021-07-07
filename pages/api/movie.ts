import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import axios from 'axios';
import { DiscordUser } from '../../types/generalTypes';
import Movie, { MovieType } from '../../models/movie';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import { MovieEndpointBodyType } from '../../types/APITypes';
import { useAPIAuth } from '../../utils/useAPIAuth';

const MovieAPI = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return null;
    }
    const { id: movieID }: MovieEndpointBodyType = JSON.parse(req.body);
    try {
      const { ...user } = verify(token, process.env.JWT_CODE) as DiscordUser & {
        iat: number;
        exp: number;
      };

      const discUser = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }

      const { data: movieData, status: movieStatus } = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.MOVIE_API_KEY}&language=en-US`
      );

      if (movieStatus !== 200 || movieData.status_code) {
        return res.status(movieStatus);
      }

      const existingMovie = await Movie.findOne({ movieID });
      if (existingMovie) {
        return res.status(400).send({ message: `Movie already exists!` });
      }

      const genres = movieData?.genres?.map((genre) => {
        return genre.name;
      });

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

      return res.status(200).send({ data: newMovie, type: `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `GET`) {
    try {
      const movies = await Movie.find({}).populate(
        `reviews.user`,
        `avatar username id discriminator`
      );

      return res.status(200).send({ data: movies });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    const { id } = JSON.parse(req.body);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const discUser = await useAPIAuth(req);
    if (!discUser || !discUser.isAdmin) {
      return res
        .status(401)
        .json({ message: `You are unauthorized to use that :(` });
    }

    const movie = await Movie.findOne({ _id: id });
    if (!movie) {
      return res.status(404);
    }
    const deletedMovie = await Movie.deleteOne({ _id: id });
    if (deletedMovie.ok === 1) {
      return res.status(200).json(movie);
    }

    return res.status(500);
  } else {
    return res.status(405).json({ message: `method not allowed` });
  }
};

export default MovieAPI;
