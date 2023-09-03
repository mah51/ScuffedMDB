import { postDataToWebhook } from './../../utils/utils';
import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';

import Movie, { MovieType, ReviewType } from '../../models/movie';
import Restaurant, { RestaurantType } from 'models/restaurant';
import dbConnect from '../../utils/dbConnect';
import { ReviewEndpointBodyType } from '../../types/APITypes';

const addMovieReview = async (review: any, movieID: any, session: any, res: any) => {
  const movie: MovieType<ReviewType<string>[]> = await Movie.findOne({
    _id: movieID,
  });

  if (!movie) {
    return res.status(404).json({ message: 'movie not found' });;
  }
  const existingReview = movie.reviews.filter(
    // eslint-disable-next-line no-underscore-dangle
    (rv) =>
      [session?.user?._id, session?.user?.sub].includes(rv.user.toString())
  )[0];
  if (existingReview) {
    if (
      ![session?.user?._id, session?.user?.sub].includes(
        existingReview.user.toString()
      )
    ) {
      return res.status(400).json({
        message: `You may not edit a review that is not your own`,
      });
    }
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
}

const addRestaurantReview = async (review: any, restaurantID: any, session: any, res: any) => {
  const restaurant: RestaurantType<ReviewType<string>[]> = await Restaurant.findOne({
    _id: restaurantID,
  });

  if (!restaurant) {
    return res.status(404).json({ message: 'restaurant not found' });;
  }
  const existingReview = restaurant.reviews.filter(
    // eslint-disable-next-line no-underscore-dangle
    (rv) =>
      [session?.user?._id, session?.user?.sub].includes(rv.user.toString())
  )[0];
  if (existingReview) {
    if (
      ![session?.user?._id, session?.user?.sub].includes(
        existingReview.user.toString()
      )
    ) {
      return res.status(400).json({
        message: `You may not edit a review that is not your own`,
      });
    }
    const index = restaurant.reviews.indexOf(existingReview);
    restaurant.reviews.splice(index, 1);
  }
  //@ts-ignore
  restaurant.reviews.push(review);
  restaurant.numReviews = restaurant.reviews.length;
  restaurant.rating =
    Math.round(
      (restaurant.reviews.reduce<number>((a, b) => a + b.rating, 0) /
        restaurant.reviews.length) *
      10
    ) / 10;
  restaurant.markModified(`reviews`);
  await restaurant.save();
  return res
    .status(200)
    .json({ restaurant, type: existingReview ? `modification` : `addition` });
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  if (req.method === `POST`) {
    const { comment, rating, movieID, restaurantID }: ReviewEndpointBodyType = JSON.parse(
      req.body
    );
    try {
      const session = await getSession({ req });
      if (!session?.user?.isReviewer && !session?.user?.isAdmin) {
        return res
          .status(401)
          .json({ message: `You are not authorized to do that :(` });
      }
      if (movieID) {
        const review = {
          // eslint-disable-next-line no-underscore-dangle
          user: session.user._id || session.user.sub,
          comment,
          rating,
        };

        await addMovieReview(review, movieID, session, res);
      }
      else if (restaurantID) {
        const review = {
          // eslint-disable-next-line no-underscore-dangle
          user: session.user._id || session.user.sub,
          comment,
          rating,
        }
        await addRestaurantReview(review, restaurantID, session, res);
      }
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    const { movieID, restaurantID, reviewID } = JSON.parse(req.body);
    const session = await getSession({ req });
    if (!session?.user?.isAdmin && !session?.user?.isReviewer) {
      return res
        .status(401)
        .json({ message: `You are not authorized to do that :(` });
    }
    if (movieID) {
      const movie: MovieType = await Movie.findOne({
        _id: movieID,
      }).populate('reviews.user', '_id discord_id image username discriminator');
      if (!movie) {
        return res.status(404).json({ message: 'movie not found' });
      }

      const review = movie.reviews.find(
        (rvw) =>
          rvw._id?.toString() === reviewID ||
          rvw.user?._id?.toString() === session?.user?.id
      );
      if (!review) {
        return res
          .status(404)
          .json({ message: 'You have not posted a review on that movie' });
      }
      if (
        !session.user.isAdmin &&
        review.user?._id.toString() !== session.user.id
      ) {
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
    }
    else if (restaurantID) {
      const restaurant: RestaurantType = await Restaurant.findOne({ _id: restaurantID }).populate('reviews.user', '_id discord_id image username discriminator');
      if (!restaurant) {
        return res.status(404).json({ message: 'restaurant not found' });
      }
      const review = restaurant.reviews.find(
        (rvw) =>
          rvw._id?.toString() === reviewID ||
          rvw.user?._id?.toString() === session?.user?.id
      );
      if (!review) {
        return res
          .status(404)
          .json({ message: 'You have not posted a review on that movie' });
      }
      if (
        !session.user.isAdmin &&
        review.user?._id.toString() !== session.user.id
      ) {
        return res
          .status(401)
          .json({ message: 'You do not have permissions to delete that review' });
      }
      restaurant.reviews.splice(restaurant.reviews.indexOf(review), 1);
      restaurant.numReviews = restaurant.reviews.length;
      restaurant.rating = restaurant.reviews.length
        ? Math.round(
          (restaurant.reviews.reduce<number>((a, b) => a + b.rating, 0) /
            restaurant.reviews.length) *
          10
        ) / 10
        : 0;
      restaurant.markModified(`reviews`);

      await restaurant.save();
    }
    return res.status(200).json({ message: `Review deleted` });
  } else {
    return res.status(405).send({ message: `method not allowed :(` });
  }
};

export default handler;
