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
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { getMovie } from '../../utils/queries';
import Error from 'next/error';
import { NextSeo } from 'next-seo';
interface MoviePageProps {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  error?: string;
}

export default function MoviePage({
  error,

  ...props
}: MoviePageProps): JSX.Element | null {
  const { colorMode } = useColorMode();
  const [session, loading] = useSession();

  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery(
    'movie',
    async () => {
      return await getMovie(id, true);
    },

    { initialData: props.movie }
  );

  useEffect(() => {
    if (!session && !loading) router.push(`/?movie=${data?._id}`);
  }, [loading, router, session, data]);

  if (!id) return <Error statusCode={404}>No movie selected</Error>;
  if (!data) {
    if (isLoading) {
      return <div>Loading</div>;
    }
    return <Error statusCode={404}>No movie found with provided ID.</Error>;
  }
  if ((typeof window !== 'undefined' && loading) || !session) return null;
  if (!session) {
    router.push(`/?movie=${data._id}`);
  }
  const user = session.user;
  if (error) {
    return <p>There was an error</p>;
  }
  if (user?.isBanned) {
    return <BannedPage user={user} />;
  }
  if (!user) {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';

    return (
      <>
        <NextSeo
          title={data.name}
          openGraph={{
            title: `${data.name} on ${siteName}`,
            type: `website`,
            site_name: siteName,
            images: [
              {
                width: 3840,
                height: 2160,
                url:
                  data.image ||
                  `https://www.movie.michael-hall.me/sitePicture.png`,
                alt: siteName + ' webpage',
              },
            ],
          }}
          description={'A private movie rating website'}
        />
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
      </>
    );
  }

  return (
    <AppLayout user={user} showMovies showReview>
      <MovieDetailsSection movie={data} user={user} />
      <MovieReviewSection movie={data} user={user} />
    </AppLayout>
  );
}

interface SSRProps {
  props: {
    session: Session | null;
    revalidate: number;
    movie: SerializedMovieType<ReviewType<PopulatedUserType>[]> | null;
  };
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<SSRProps> {
  const { id } = ctx.query;
  if (!id) return { props: { session: null, revalidate: 60, movie: null } };
  const session = await getSession();
  const movie = await getMovie(id, true);

  return {
    props: {
      revalidate: 60,
      movie,
      session,
    },
  };
}
