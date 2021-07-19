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

interface HomePageProps {
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
}

export default function Home({ movies }: HomePageProps): React.ReactNode {
  const [session, loading] = useSession();

  const { data } = useQuery(`movies`, getMovies, {
    initialData: movies,
  });

  if (typeof window !== 'undefined' && loading) return null;

  if (!session?.user) {
    return <LandingPage />;
  }
  if (session?.user?.isBanned) {
    return <BannedPage user={session.user} />;
  }
  //idk typescript well enough to know whats goin wrong here but | any ignores it :/ :(
  // eslint-disable-next-line react-hooks/rules-of-hooks

  if (!data) {
    return <div>There was an error locating movie data :(</div>;
  }

  return <HomePage user={session.user} movies={data} />;
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  props: {
    session: Session | null;
    movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  };
}> => {
  //Scuffed, but makes sure that Schema gets registered before next-auth tries to access it.
  const movies = await getMovies();
  const session = await getSession(ctx);

  return { props: { session, movies } };
};
