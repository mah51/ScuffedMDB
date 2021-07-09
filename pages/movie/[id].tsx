import { Flex, Heading, Text, useColorMode } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import AppLayout from '../../components/AppLayout';
import BannedPage from '../../components/BannedPage';
import MovieDetailsSection from '../../components/MovieDetailsSection';
import MovieReviewSection from '../../components/MovieReviewSection';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import { parseUser } from '../../utils/parseDiscordUser';
import { getMovie } from '../../utils/queries';

interface MoviePageProps {
  movie?: MovieType<ReviewType<UserType>[]>;
  revalidate?: number;
  error?: string;
  user?: UserType;
}

export default function MoviePage({
  movie,
  error,
  user,
}: MoviePageProps): JSX.Element {
  const { colorMode } = useColorMode();
  if (error) {
    return <p>There was an error</p>;
  }
  if (user?.isBanned) {
    return <BannedPage user={user} />;
  }
  if (!user) {
    return (
      <Flex
        height="full"
        width="full"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Heading>You are not authorized to view this page 😢</Heading>

        <Text
          color={colorMode === 'light' ? `gray.400` : `gray.600`}
          as="a"
          href="/"
        >
          Click to go to the homepage!
        </Text>
      </Flex>
    );
  }
  return (
    <AppLayout user={user} showMovies showReview>
      <MovieDetailsSection movie={movie} user={user} />
      <MovieReviewSection movie={movie} />
    </AppLayout>
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
    return { props: { user: null } };
  }
  const movie: any = await getMovie(
    typeof id === 'string' ? id : id.join(''),
    true
  );

  return {
    props: {
      revalidate: 60,
      movie,
      user,
    },
  };
}
