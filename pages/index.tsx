import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import React from 'react';
import { useQuery, dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import BannedPage from '../components/BannedPage';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { ReviewType, SerializedMovieType } from '../models/movie';
import user, { PopulatedUserType } from '../models/user';
import { getMovie, getMovies, getRestaurant, getRestaurants } from '../utils/queries';
import { SerializedRestaurantType } from 'models/restaurant';
import {
  Center,
  Spinner,
} from '@chakra-ui/react';

interface HomePageProps {
  session: Session;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[] | null;
  restaurants: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>[] | null;
  singleMovieData: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  singleRestaurantData: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>;
  desiredUser?: { username: string; _id: string; image: string };
  dehydratedState?: any;
}

export default function Home({
  session,
  movies,
  restaurants,
  singleMovieData,
  singleRestaurantData,
  desiredUser,
}: HomePageProps): React.ReactNode {
  if (!session?.user) {
    return (
      <LandingPage
        desiredUser={desiredUser || undefined}
        movie={singleMovieData || undefined}
        restaurant={singleRestaurantData || undefined}
      />
    );
  }
  if (session?.user?.isBanned) {
    return <BannedPage user={session.user} />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, isLoading: movieLoading } = useQuery(['movies'], () => getMovies());

  const { data: restaurantData, error: restaurantError, isLoading: restaurantLoading } = useQuery(['restaurants'], () => getRestaurants())

  if (error || restaurantError) {
    return <div>There was an error locating data :(</div>;
  }

  if (!data) {
    return <div />;
  }

  return (
    <>
      {
        (movieLoading || restaurantLoading) ? (
          <Center className='h-screen'>
            <Spinner
              mt={6}
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={`${process.env.COLOR_THEME}.200`}
              size="xl"
            />
          </Center>
        ) : (
          <HomePage user={session.user} movies={data} restaurants={restaurantData} />
        )
      }
    </>
  )
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  redirect?: { destination: string; permanent: boolean };

  props?: {
    session?: Session | null;
    movies?: SerializedMovieType<ReviewType<PopulatedUserType>[]>[] | null;
    restaurants?: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>[] | null;
    singleMovieData?: SerializedMovieType<
      ReviewType<PopulatedUserType>[]
    > | null;
    singleRestaurantData?: SerializedRestaurantType<ReviewType<PopulatedUserType>[]> | null;
    desiredUser?: { username: string; sub: string; image: string } | null;
    dehydratedState?: any;
  };
}> => {
  const session = await getSession(ctx);
  const queryClient = new QueryClient();
  if (!session?.user) {
    let singleMovieData: SerializedMovieType<
      ReviewType<PopulatedUserType>[]
    > | null = null;
    let singleRestaurantData: SerializedRestaurantType<
      ReviewType<PopulatedUserType>[]
    > | null = null;
    let desiredUser = null;

    if (ctx.query.movie) {
      // singleMovieData = await getMovie(ctx.query.movie, true);
      await queryClient.fetchQuery([`movie-${ctx.query.movie}`, ctx.query.movie], () => getMovie(ctx.query.movie, true));
    }
    if (ctx.query.restaurant) {
      // singleRestaurantData = await getRestaurant(ctx.query.restaurant, true);
      await queryClient.fetchQuery([`restaurant-${ctx.query.restaurant}`, ctx.query.movie], () => getRestaurant(ctx.query.restaurant, true));
    }
    if (ctx.query.user) {
      try {
        desiredUser = await user.findById(ctx.query.user).lean();
      } catch (e) {
        return { props: { session, movies: [], restaurants: [] } };
      }
    }
    return {
      props: {
        session,
        movies: [],
        restaurants: [],
        singleMovieData: singleMovieData ? singleMovieData : null,
        singleRestaurantData: singleRestaurantData ? singleRestaurantData : null,
        desiredUser: desiredUser
          ? {
            username: desiredUser.username,
            sub: desiredUser._id.toString(),
            image: desiredUser.image,
          }
          : null,
      },
    };
  }
  if (ctx.query.movie) {
    return {
      redirect: {
        destination: `/movie/${ctx.query.movie}${ctx.query.review === 'true' ? '?review=true' : ''
          }`,
        permanent: false,
      },
    };
  }
  if (ctx.query.restaurant) {
    return {
      redirect: {
        destination: `/restaurant/${ctx.query.restaurant}${ctx.query.review === 'true' ? '?review=true' : ''}`,
        permanent: false
      },
    }
  };
  if (ctx.query.user) {
    return {
      redirect: {
        destination: `/user/${ctx.query.user}`,
        permanent: false,
      },
    };
  }
  let movies = null;
  if (session?.user) {
    await queryClient.fetchQuery([`movies`], () => getMovies());
    await queryClient.fetchQuery([`restaurants`], () => getMovies());
  }

  return { props: { session, movies } };
};
