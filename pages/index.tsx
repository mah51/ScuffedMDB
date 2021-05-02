import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { HomePage } from '../components/HomePage';
import { LandingPage } from '../components/LandingPage';
import { DiscordUser } from '../types/generalTypes';
import { parseUser } from '../utils/parseDiscordUser';

interface HomePageProps {
  user: DiscordUser | null;
  movies: [];
}

export default function Home(props: HomePageProps) {
  if (!props.user) {
    return <LandingPage />;
  }

  return <HomePage user={props.user} movies={props.movies} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = parseUser(ctx);
  if (!user) {
    return { props: { user: null } };
  }
  const { data: movies } = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`,
  );
  return { props: { user, movies } };
};
