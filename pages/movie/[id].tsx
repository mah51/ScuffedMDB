import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQuery, QueryClient } from '@tanstack/react-query';
import AppLayout from '../../components/AppLayout';
import MovieDetailsSection from '../../components/MovieDetailsSection';
import { getMovie } from '../../utils/queries';
import { NextSeo } from 'next-seo';
import ErrorPage from '@components/ErrorPage';
import ReviewModal from '@components/ReviewModal';
import ReviewSection from '@components/ReviewSection/ReviewSection';


interface MoviePageProps {
  error?: string;
}

export default function MoviePage({
  error
}: MoviePageProps): JSX.Element | null {
  const [session, loading] = useSession();

  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery([`movie-${id}`, id], () => getMovie(id, true));

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
      <ReviewSection movie={data} />
      <ReviewModal user={session?.user} showReviewButton={false} />
    </AppLayout>
  );
}

interface SSRProps {
  props?: {
    session: Session | null;
    dehydratedState?: any;
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
  const queryClient = new QueryClient();

  if (!id)
    return {
      props: { session: null },
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

  await queryClient.fetchQuery([`movie-${id}`, id], () => getMovie(id, true));

  return {
    props: {
      session
    },
  };
}
