import React from 'react';
import { useQuery } from 'react-query';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { getMovie, getMovies } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { ReviewType, SerializedMovieType } from '../models/movie';
import { getSession, useSession } from 'next-auth/client';
import user, { PopulatedUserType } from '../models/user';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';

interface HomePageProps {
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  singleMovieData: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  desiredUser?: { username: string; _id: string; image: string };
}

export default function Home({
  movies,
  singleMovieData,
  desiredUser,
}: HomePageProps): React.ReactNode {
  const [session, loading] = useSession();

  if (typeof window !== 'undefined' && loading) return null;

  if (!session?.user) {
    return (
      <LandingPage
        desiredUser={desiredUser || undefined}
        movie={singleMovieData || undefined}
      />
    );
  }
  if (session?.user?.isBanned) {
    return <BannedPage user={session.user} />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery(`movies`, getMovies, {
    initialData: movies,
  });

  if (!data) {
    return <div>There was an error locating movie data :(</div>;
  }

  return <HomePage user={session.user} movies={data} />;
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  redirect?: { destination: string; permanent: boolean };

  props?: {
    session?: Session | null;
    movies?: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
    singleMovieData?: SerializedMovieType<
      ReviewType<PopulatedUserType>[]
    > | null;
    desiredUser?: { username: string; sub: string; image: string } | null;
  };
}> => {
  const session = await getSession(ctx);

  if (!session?.user) {
    let singleMovieData: SerializedMovieType<
      ReviewType<PopulatedUserType>[]
    > | null = null;
    let desiredUser = null;
    if (ctx.query.movie) {
      singleMovieData = await getMovie(ctx.query.movie, true);
    }
    if (ctx.query.user) {
      try {
        desiredUser = await user.findById(ctx.query.user).lean();
      } catch (e) {
        return { props: { session, movies: [] } };
      }
    }
    return {
      props: {
        session,
        movies: [],
        singleMovieData: singleMovieData ? singleMovieData : null,
        desiredUser: desiredUser
          ? {
              username: desiredUser.username,
              sub: desiredUser._id.toString(),
              image: desiredUser.image,
            }
          : null,
      },
    };
  }
  if (ctx.query.movie) {
    return {
      redirect: {
        destination: `/movie/${ctx.query.movie}`,
        permanent: false,
      },
    };
  }
  if (ctx.query.user) {
    return {
      redirect: {
        destination: `/user/${ctx.query.user}`,
        permanent: false,
      },
    };
  }
  const movies = await getMovies();

  return { props: { session, movies } };
};
