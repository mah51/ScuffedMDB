import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';

import Movie, { MovieType, ReviewType } from '../../models/movie';
import dbConnect from '../../utils/dbConnect';
import { ReviewEndpointBodyType } from '../../types/APITypes';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  if (req.method === `POST`) {
    const { comment, rating, movieID }: ReviewEndpointBodyType = JSON.parse(
      req.body
    );
    try {
      const session = await getSession({ req });
      if (!session?.user?.isReviewer && !session?.user?.isAdmin) {
        return res
          .status(401)
          .json({ message: `You are not authorized to do that :(` });
      }

      const review = {
        // eslint-disable-next-line no-underscore-dangle
        user: session.user.sub,
        comment,
        rating,
      };

      const movie: MovieType<ReviewType<string>[]> = await Movie.findOne({
        _id: movieID,
      });
      if (!movie) {
        return res.status(404);
      }
      const existingReview = movie.reviews.filter(
        // eslint-disable-next-line no-underscore-dangle
        (rv) => rv.user.toString() === session.user.id
      )[0];
      if (existingReview) {
        const index = movie.reviews.indexOf(existingReview);
        movie.reviews.splice(index, 1);
      }
      //@ts-ignore
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        Math.round(
          (movie.reviews.reduce<number>((a, b) => a + b.rating, 0) /
            movie.reviews.length) *
            10
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
  } else if (req.method === `DELETE`) {
    const { movieID, reviewID } = JSON.parse(req.body);
    const session = await getSession({ req });
    if (!session?.user?.isAdmin && !session?.user?.isReviewer) {
      return res
        .status(401)
        .json({ message: `You are not authorized to do that :(` });
    }
    const movie: MovieType<ReviewType<string>[]> = await Movie.findOne({
      _id: movieID,
    });
    if (!movie) {
      return res.status(404).json({ message: 'movie not found' });
    }

    const review = movie.reviews.find(
      (rvw) =>
        rvw._id.toString() === reviewID ||
        rvw.user.toString() === session?.user?.id
    );
    if (!review) {
      return res
        .status(404)
        .json({ message: 'You have not posted a review on that movie' });
    }
    if (!session.user.isAdmin && review.user.toString() !== session.user.id) {
      return res
        .status(401)
        .json({ message: 'You do not have permissions to delete that review' });
    }
    movie.reviews.splice(movie.reviews.indexOf(review), 1);
    movie.numReviews = movie.reviews.length;
    movie.rating = movie.reviews.length
      ? Math.round(
          (movie.reviews.reduce<number>((a, b) => a + b.rating, 0) /
            movie.reviews.length) *
            10
        ) / 10
      : 0;
    movie.markModified(`reviews`);
    await movie.save();
    return res.status(200).json({ message: `Review deleted` });
  } else {
    return res.status(405).send({ message: `method not allowed :(` });
  }
};

export default handler;
