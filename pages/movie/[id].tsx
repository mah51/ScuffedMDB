import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';
import AppLayout from '../../components/AppLayout';
import MovieDetailsSection from '../../components/MovieDetailsSection';
import MovieReviewSection from '../../components/MovieReviewSection';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { getMovie } from '../../utils/queries';
import { NextSeo } from 'next-seo';
import ErrorPage from '@components/ErrorPage';
import ReviewModal from '@components/ReviewModal';


interface MoviePageProps {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  error?: string;
}

export default function MoviePage({
  error,
  ...props
}: MoviePageProps): JSX.Element | null {
  const [session, loading] = useSession();

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useQuery(
    `movie-${props?.movie?.name}`,
    async () => {
      return await getMovie(id, true);
    },

    { initialData: props?.movie }
  );

  if ((typeof window !== 'undefined' && loading) || !session) return null;
  if (!id) return <ErrorPage statusCode={404} message="No movie selected" />;
  if (!data) {
    if (isLoading) {
      return <div>Loading</div>;
    }
    return (
      <ErrorPage statusCode={404} message="No movie found with provided ID" />
    );
  }

  const user = session.user;
  if (error) {
    return <p>There was an error</p>;
  }

  return (
    <AppLayout user={user} showMovies showReview>
      <NextSeo title={data.name} />
      <MovieDetailsSection movie={data} user={user} />
      <MovieReviewSection movie={data} />
      <ReviewModal user={session?.user} inMobileNav/>
    </AppLayout>
  );
}

interface SSRProps {
  props?: {
    session: Session | null;
    movie: SerializedMovieType<ReviewType<PopulatedUserType>[]> | null;
  };
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<SSRProps> {
  const { id, review } = ctx.query;

  if (!id)
    return {
      props: { session: null, movie: null },
    };
  const session = await getSession({ req: ctx.req });
  if (!session)
    return {
      redirect: {
        destination: `/?movie=${id}&review=${review}`,
        permanent: false,
      },
    };

  if (session?.user?.isBanned)
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };

  const movie = await getMovie(id, true);

  return {
    props: {
      movie,
      session,
    },
  };
}
