import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { MovieType } from '../../models/movie';
import { parseUser } from '../../utils/parseDiscordUser';
import { getMovie } from '../../utils/queries';

interface MoviePageProps {
  movie?: MovieType;
  revalidate?: number;
  error?: string;
}

export default function MoviePage({
  movie,
  error,
}: MoviePageProps): JSX.Element {
  return (
    <div>
      <p>Welcome to the new movie page :)</p>
    </div>
  );
}

interface SSRProps {
  props: MoviePageProps;
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<SSRProps> {
  const { id } = ctx.query;
  const user = await parseUser(ctx);
  if (!user) {
    return { props: { error: 'No auth' } };
  }
  const movie: any = await getMovie(
    typeof id === 'string' ? id : id.join(''),
    true
  );

  return {
    props: {
      revalidate: 60,
      movie,
    },
  };
}
