import React from 'react';
import { useQuery } from 'react-query';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { getMovies } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { ReviewType, SerializedMovieType } from '../models/movie';
import { getSession, useSession } from 'next-auth/client';
import { PopulatedUserType } from '../models/user';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface HomePageProps {
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
}

export default function Home({ movies }: HomePageProps): React.ReactNode {
  const [session, loading] = useSession();
  const router = useRouter();
  const { movie: movieId } = router.query;
  const { data } = useQuery(`movies`, getMovies, {
    initialData: movies,
  });

  if (typeof window !== 'undefined' && loading) return null;
  if (!data) {
    return <div>There was an error locating movie data :(</div>;
  }
  if (!session?.user) {
    return <LandingPage movie={data.find((movie) => movie._id === movieId)} />;
  }
  if (session?.user?.isBanned) {
    return <BannedPage user={session.user} />;
  }
  //idk typescript well enough to know whats goin wrong here but | any ignores it :/ :(
  // eslint-disable-next-line react-hooks/rules-of-hooks

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
  //Scuffed, but makes sure that Schema gets registered before next-auth tries to access it.
  const movies = await getMovies();
  const session = await getSession(ctx);
  if (session?.user) {
    if (ctx.query.movie) {
      return {
        redirect: {
          destination: `/movie/${ctx.query.movie}`,
          permanent: false,
        },
      };
    }
  }
  return { props: { session, movies } };
};
