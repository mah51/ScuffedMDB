import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import React from 'react';
import { useQuery } from 'react-query';
import BannedPage from '../components/BannedPage';
import HomePage from '../components/HomePage';
import LandingPage from '../components/LandingPage';
import { ReviewType, SerializedMovieType } from '../models/movie';
import user, { PopulatedUserType } from '../models/user';
import { getMovie, getMovies, getRestaurant, getRestaurants } from '../utils/queries';
import { SerializedRestaurantType } from 'models/restaurant';

interface HomePageProps {
  session: Session;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[] | null;
  restaurants: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>[] | null;
  singleMovieData: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  singleRestaurantData: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>;
  desiredUser?: { username: string; _id: string; image: string };
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
  const { data, error } = useQuery(`movies`, getMovies, {
    initialData: movies,
  });

  const {data: restaurantData, error: restaurantError} = useQuery(`restaurants`, getRestaurants, {
    initialData: restaurants,
  })

  if (error || restaurantError) {
    return <div>There was an error locating data :(</div>;
  }

  if (!data) {
    return <div />;
  }

  return <HomePage user={session.user} movies={data} restaurants={restaurantData}/>;
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
  };
}> => {
  const session = await getSession(ctx);
  if (!session?.user) {
    let singleMovieData: SerializedMovieType<
      ReviewType<PopulatedUserType>[]
    > | null = null;
    let singleRestaurantData: SerializedRestaurantType<
    ReviewType<PopulatedUserType>[]
  > | null = null;
    let desiredUser = null;

    if (ctx.query.movie) {
      singleMovieData = await getMovie(ctx.query.movie, true);
    }
    if (ctx.query.restaurant) {
      singleRestaurantData = await getRestaurant(ctx.query.restaurant, true);
    }
    if (ctx.query.user) {
      try {
        desiredUser = await user.findById(ctx.query.user).lean();
      } catch (e) {
        return { props: { session, movies: [] } };
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
        destination: `/movie/${ctx.query.movie}${
          ctx.query.review === 'true' ? '?review=true' : ''
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
    movies = await getMovies();
  }

  return { props: { session, movies } };
};
