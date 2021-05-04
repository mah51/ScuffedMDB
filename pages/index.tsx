import { GetServerSideProps } from 'next';
import React from 'react';
import { useQuery } from 'react-query';
import { HomePage } from '../components/HomePage';
import { LandingPage } from '../components/LandingPage';
import { DiscordUser } from '../types/generalTypes';
import { parseUser } from '../utils/parseDiscordUser';
import { getMovies } from '../utils/queries';

interface HomePageProps {
  user: DiscordUser | null;
  movies: [];
}

export default function Home({ user, movies }: HomePageProps) {
  if (!user) {
    return <LandingPage />;
  }
  const { data } = useQuery(`movies`, getMovies, { initialData: movies });
  return <HomePage user={user} movies={data} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = parseUser(ctx);
  if (!user) {
    return { props: { user: null } };
  }
  const movies = await getMovies();
  return { props: { user, movies } };
};
