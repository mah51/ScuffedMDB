import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import axios from 'axios';
import { config } from '../../utils/config';
import { DiscordUser } from '../../types/generalTypes';
import Movie, { MovieType } from '../../models/movie';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import { MovieEndpointBodyType } from '../../types/APITypes';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return null;
    }

    const token = parse(req.headers.cookie)[config.cookieName];
    if (!token) {
      return null;
    }
    const { id: movieID }: MovieEndpointBodyType = req.body;
    try {
      const { iat, exp, ...user } = verify(
        token,
        config.jwtSecret,
      ) as DiscordUser & { iat: number; exp: number };
      const discUser = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }
      const { data: movieData, status } = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieID}?api_key=${config.movieAPIKey}&language=en-US`,
      );
      if (status !== 200 || movieData.status_code) {
        return res.status(status);
      }
      const newMovie: MovieType = new Movie({
        name: movieData.original_title,
        image: `https://image.tmdb.org/t/p/original/${movieData.backdrop_path}`,
        description: movieData.overview,
        tagLine: movieData.tagline,
        rating: 0,
        numReviews: 0,
        reviews: [],
      });
      await newMovie.save();
      return res.status(200).send({ data: newMovie });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `GET`) {
    try {
      const movies = await Movie.find({}).populate(
        `reviews.user`,
        `avatar username id discriminator`,
      );
      res.status(200).send({ data: movies });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  }
};
