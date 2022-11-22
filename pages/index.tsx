import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import React from 'react';
import { useQuery } from 'react-query';
import BannedPage from '../components/BannedPage';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { ReviewType, SerializedMovieType } from '../models/movie';
import user, { PopulatedUserType } from '../models/user';
import { getMovie, getMovies } from '../utils/queries';

interface HomePageProps {
  session: Session;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[] | null;
  singleMovieData: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  desiredUser?: { username: string; _id: string; image: string };
}

export default function Home({
  session,
  movies,
  singleMovieData,
  desiredUser,
}: HomePageProps): React.ReactNode {
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
  const { data, error } = useQuery(`movies`, getMovies, {
    initialData: movies,
  });

  if (error) {
    return <div>There was an error locating movie data :(</div>;
  }

  if (!data) {
    return <div />;
  }

  return <HomePage user={session.user} movies={data} />;
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  redirect?: { destination: string; permanent: boolean };

  props?: {
    session?: Session | null;
    movies?: SerializedMovieType<ReviewType<PopulatedUserType>[]>[] | null;
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
        destination: `/movie/${ctx.query.movie}${
          ctx.query.review === 'true' ? '?review=true' : ''
        }`,
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
  let movies = null;
  if (session?.user) {
    movies = await getMovies();
  }

  return { props: { session, movies } };
};
