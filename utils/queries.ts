import { SerializedUser, PopulatedUserType } from './../models/user';
import { ReviewType, SerializedMovieType } from '../models/movie';

export const getMovies = async (): Promise<
  SerializedMovieType<ReviewType<PopulatedUserType>[]>[]
> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`
  );
  // eslint-disable-next-line no-return-await
  const unsortedMovies: {
    data: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  } = await res.json();

  const movies: SerializedMovieType<
    ReviewType<PopulatedUserType>[]
  >[] = unsortedMovies.data
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .reverse();
  return movies;
};

export const getMovie = async (
  id: string | string[] | undefined,
  isLean: boolean
): Promise<SerializedMovieType<ReviewType<PopulatedUserType>[]> | null> => {
  if (!id) {
    return null;
  }
  if (Array.isArray(id)) {
    id = id.join('');
  }
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/movie/${id}/${
      isLean && '?isLean=true'
    }`
  );

  // eslint-disable-next-line no-return-await
  const movie: SerializedMovieType<
    ReviewType<PopulatedUserType>[]
  > = await res.json();

  return movie;
};

export const getUsers = async (): Promise<SerializedUser[]> => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/users`
  );

  const { users }: { users: SerializedUser[] } = await res.json();

  return users;
};
