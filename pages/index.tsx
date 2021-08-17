import React from 'react';
import { useQuery } from 'react-query';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { getMovie, getMovies } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { ReviewType, SerializedMovieType } from '../models/movie';
import { getSession, useSession } from 'next-auth/client';
import { PopulatedUserType } from '../models/user';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

interface HomePageProps {
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
}

export default function Home({ movies }: HomePageProps): React.ReactNode {
  const [session, loading] = useSession();
  const router = useRouter();
  const { movie: movieId } = router.query;
  const [
    singleMovieData,
    setSingleMovieData,
  ] = useState<SerializedMovieType | null>(null);

  useEffect(() => {
    if (movieId) {
      getMovie(movieId, true)
        .then((x) => setSingleMovieData(x))
        .catch(console.error);
    }
  });

  if (typeof window !== 'undefined' && loading) return null;

  if (!session?.user) {
    return <LandingPage movie={singleMovieData || undefined} />;
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
  };
}> => {
  const session = await getSession(ctx);
  if (!session?.user) {
    return {
      props: {
        session,
        movies: [],
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
