import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import { DiscordUser } from '../../types/generalTypes';
import Movie, { MovieType } from '../../models/movie';
import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import { ReviewEndpointBodyType } from '../../types/APITypes';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === `POST`) {
    if (!req.headers.cookie) {
      return null;
    }

    const { token } = parse(req.headers.cookie);
    if (!token) {
      return null;
    }

    const { comment, rating, movieID }: ReviewEndpointBodyType = JSON.parse(
      req.body,
    );
    try {
      const { iat, exp, ...user } = verify(
        token,
        process.env.JWT_TOKEN,
      ) as DiscordUser & { iat: number; exp: number };
      const discUser: any = await User.findOne({ id: user.id });
      if (!discUser) {
        return res.status(401);
      }
      const review = {
        // eslint-disable-next-line no-underscore-dangle
        user: discUser._id,
        comment,
        rating,
      };

      const movie: MovieType = await Movie.findOne({ _id: movieID });
      if (!movie) {
        return res.status(404);
      }
      const existingReview = movie.reviews.filter(
        // eslint-disable-next-line no-underscore-dangle
        (rv) => rv.user.toString() === discUser._id.toString(),
      )[0];
      if (existingReview) {
        const index = movie.reviews.indexOf(existingReview);
        movie.reviews.splice(index, 1);
      }
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        Math.round(
          (movie.reviews.reduce<number>((a, b) => a + b.rating, 0) /
            movie.reviews.length) *
            10,
        ) / 10;
      movie.markModified(`reviews`);
      await movie.save();
      return res
        .status(200)
        .json({ movie, type: existingReview ? `modification` : `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else {
    return null;
  }
};
