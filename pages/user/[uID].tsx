import React, { useEffect } from 'react';
import { Divider, Flex } from '@chakra-ui/react';
import AppLayout from '../../components/AppLayout';
import AboutUserSection from '../../components/AboutUserSection';
import User, {
  MongoUser,
  PopulatedUserType,
  SerializedUser,
} from '../../models/user';
import { getMovies } from '../../utils/queries';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import UserReviewSection from '../../components/UserReviewSection';
import type { GetServerSidePropsContext } from 'next';
import dbConnect from '../../utils/dbConnect';
import { getSession, useSession } from 'next-auth/client';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { NextSeo } from 'next-seo';

interface EditUserProps {
  desiredUser: SerializedUser | null;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
}

function EditUser({ desiredUser, ...props }: EditUserProps): React.ReactNode {
  const { data } = useQuery(
    'movies',
    async () => {
      return await getMovies();
    },

    { initialData: props.movies }
  );
  const movies = data;
  const [session, loading] = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session && !loading) router.push('/');
  }, [loading, router, session]);
  if ((typeof window !== 'undefined' && loading) || !session) return null;
  if (!session) {
    router.push('/');
  }
  const user = session.user;

  if (!desiredUser) {
    return <div>That user could not be found :(</div>;
  }

  if (!movies) {
    return <div>Loading movies :(</div>;
  }

  const allRatings: (
    | (ReviewType<PopulatedUserType> & {
        movie?: { name: string; image?: string; _id: string };
      })
    | null
  )[] = movies
    ?.map((movie) => {
      const rev:
        | (ReviewType<PopulatedUserType> & {
            movie?: { name: string; image?: string; _id: string };
          })
        | undefined = movie?.reviews?.find((review) => {
        if (!review.user) return false; // If user is deleted and has made a review the user object is null in the review.
        return review.user._id === desiredUser._id;
      });
      if (!rev) {
        return null;
      }
      rev.movie = {
        _id: movie._id,
        name: movie.name,
        image: movie.image,
      };
      return rev;
    })
    .filter((x) => x)
    .sort((a, b) => (a && b ? a.rating - b.rating : 0))
    .reverse();

  return (
    <AppLayout user={user} showReview>
      <NextSeo title={desiredUser.name + '#' + desiredUser.discriminator} />
      <Flex direction="column" pt={16} maxW="6xl" mx="auto">
        <AboutUserSection user={desiredUser} reviews={allRatings} />
        <Divider mt={10} />
        <UserReviewSection movies={movies} user={user} />
        {/* <UserStatsSection /> */}
      </Flex>
    </AppLayout>
  );
}

interface returnProps {
  props: {
    session: Session | null;
    desiredUser: SerializedUser | null;
    movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  };
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<returnProps> {
  const { uID } = ctx.query;
  await dbConnect();
  const session = await getSession(ctx);

  const desiredUser: SerializedUser | MongoUser = await User.findById(
    uID
  ).lean();

  if (!desiredUser)
    return { props: { desiredUser: null, session, movies: [] } };

  desiredUser._id = desiredUser._id.toString();
  desiredUser.createdAt =
    typeof desiredUser.createdAt === 'string'
      ? desiredUser.createdAt
      : desiredUser.createdAt.toISOString();
  desiredUser.updatedAt =
    typeof desiredUser.updatedAt === 'string'
      ? desiredUser.updatedAt
      : desiredUser.updatedAt.toISOString();

  assertsIsSerializedUser(desiredUser);
  const movies = await getMovies();
  return {
    props: {
      session,
      desiredUser: desiredUser || null,
      movies: movies,
    },
  };
}

export default EditUser;

function assertsIsSerializedUser(
  user: unknown
): asserts user is SerializedUser {
  if (typeof user === 'object') {
    if (user) {
      if ('createdAt' in user && 'updatedAt' in user && '_id' in user) {
        const { createdAt, updatedAt, _id } = user as {
          createdAt: any;
          updatedAt: any;
          _id: any;
        };
        if (
          typeof createdAt === 'string' &&
          typeof updatedAt === 'string' &&
          typeof _id === 'string'
        ) {
          return;
        }
      }
    }
  }
  throw new Error('User is not serialized');
}
