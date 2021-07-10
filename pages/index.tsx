import { GetServerSideProps } from 'next';
import React from 'react';
import { useQuery } from 'react-query';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { getMovies } from '../utils/queries';
import BannedPage from '../components/BannedPage';
import { MovieType, ReviewType } from '../models/movie';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/client';
import { UserAuthType } from '../types/next-auth';
import { UserType } from '../models/user';

interface HomePageProps {
  movies: MovieType<ReviewType<UserType>[]>[];
  session: UserAuthType;
}

export default function Home({ movies }: HomePageProps): React.ReactChild {
  const router = useRouter();
  const [session, loading] = useSession();

  if (typeof window !== 'undefined' && loading) return null;

  const { movieID } = router.query;
  if (!session?.user) {
    return <LandingPage />;
  }
  if (session?.user?.isBanned) {
    return <BannedPage user={session.user} />;
  }
  //idk typescript well enough to know whats goin wrong here but | any ignores it :/ :(
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data: MovieType<ReviewType<UserType>[]>[] | any = useQuery(
    `movies`,
    getMovies,
    {
      initialData: movies,
    }
  );

  return <HomePage user={session.user} movies={data} movieID={movieID} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //Scuffed, but makes sure that Schema gets registered before next-auth tries to access it.
  const movies = await getMovies();
  const session = await getSession(ctx);

  return { props: { session, movies } };
};
