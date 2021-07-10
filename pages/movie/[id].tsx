import { Flex, Heading, Text, useColorMode } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import AppLayout from '../../components/AppLayout';
import BannedPage from '../../components/BannedPage';
import MovieDetailsSection from '../../components/MovieDetailsSection';
import MovieReviewSection from '../../components/MovieReviewSection';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import { getMovie } from '../../utils/queries';

interface MoviePageProps {
  movie?: MovieType<ReviewType<UserType>[]>;
  revalidate?: number;
  error?: string;

  session?: Session;
}

export default function MoviePage({
  error,
  ...props
}: MoviePageProps): JSX.Element {
  const { colorMode } = useColorMode();
  const [session, loading] = useSession();

  const router = useRouter();
  const { id } = router.query;
  const { data }: { data: MovieType<ReviewType<UserType>[]> } = useQuery(
    'movie',
    async () => {
      return await getMovie(typeof id === 'string' ? id : id.join(''), true);
    },
    //@ts-ignore
    { initialData: props.movie }
  );
  useEffect(() => {
    if (!session && !loading) router.push('/');
  }, [loading, router, session]);
  if ((typeof window !== 'undefined' && loading) || !session) return null;
  if (!session) {
    router.push('/');
  }
  const user = session.user;
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
      <MovieDetailsSection movie={data} user={user} />
      <MovieReviewSection movie={data} />
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
  const session = await getSession();
  const movie: any = await getMovie(
    typeof id === 'string' ? id : id.join(''),
    true
  );

  return {
    props: {
      revalidate: 60,
      movie,
      session,
    },
  };
}
