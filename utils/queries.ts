import { MovieType } from '../models/movie';
import user from '../models/user';
import dbConnect from './dbConnect';

export const getMovies = async (): Promise<MovieType[]> => {
  const db = await dbConnect();
  //Scuffed, but makes sure that Schema gets registered before next-auth tries to access it.
  const unSortedMovies = await db.models.Movie.find({}).lean();

  // eslint-disable-next-line no-return-await

  const movies = unSortedMovies
    .map((movie) => {
      const reviews = movie.reviews.map((review) => ({
        ...review,
        _id: review._id.toString(),
        user: {
          ...review.user,
          id: review.user.id.toString(),
          createdAt: review.user.createdAt?.getTime(),
          updatedAt: review.user.updatedAt?.getTime(),
        },
      }));
      return {
        ...movie,
        reviews,
        _id: movie._id.toString(),
        createdAt: movie.createdAt.getTime(),
        updatedAt: movie.updatedAt.getTime(),
      };
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .reverse();

  return movies;
};

export const getMovie = async (
  id: string,
  isLean: boolean
): Promise<MovieType> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/movie/${id}/${
      isLean && '?isLean=true'
    }`
  );

  // eslint-disable-next-line no-return-await
  const movie = await res.json();

  return movie;
};
