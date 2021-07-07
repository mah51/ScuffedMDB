import React from 'react';
import { Divider, Flex } from '@chakra-ui/react';
import { UserType } from '../../models/user';
import { parseUser } from '../../utils/parseDiscordUser';
import AppLayout from '../../components/AppLayout';
import AboutUserSection from '../../components/AboutUserSection';
import User from '../../models/user';
import { getMovies } from '../../utils/queries';
import { MovieType } from '../../models/movie';
import UserReviewSection from '../../components/UserReviewSection';
import type { GetServerSidePropsContext } from 'next';
import dbConnect from '../../utils/dbConnect';

interface EditUserProps {
  user: UserType;
  desiredUser: UserType;
  movies: MovieType[];
}

function EditUser({
  user,
  desiredUser,
  movies,
}: EditUserProps): React.ReactChild {
  if (!user) {
    return null;
  }

  const allRatings = movies
    .map((movie: any) => {
      const rev = movie?.reviews?.find(
        (review: any) => review.user.id === desiredUser.id
      );
      if (!rev) {
        return null;
      }
      rev.movie = {
        name: movie.name,
        image: movie.image,
      };
      return rev;
    })
    .filter((x) => (x ? true : false))
    .sort((a, b) => a.rating - b.rating)
    .reverse();
  return (
    <AppLayout user={user}>
      <Flex direction="column" pt={16} maxW="6xl" mx="auto">
        <AboutUserSection user={desiredUser} reviews={allRatings} />
        <Divider mt={10} />
        <UserReviewSection reviews={allRatings} />
        {/* <UserStatsSection /> */}
      </Flex>
    </AppLayout>
  );
}

interface returnProps {
  props: EditUserProps;
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<returnProps> {
  const { uID } = ctx.query;
  const user: UserType = await parseUser(ctx);
  await dbConnect();
  let desiredUser: any;
  if (user && uID !== 'me') {
    desiredUser = await User.findById(uID).lean();
    desiredUser._id = desiredUser._id.toString();
    desiredUser.createdAt = desiredUser.createdAt.getTime();
    desiredUser.updatedAt = desiredUser.updatedAt.getTime();
  } else if (uID === 'me') {
    desiredUser = user;
  }
  const movies = await getMovies();
  return {
    props: {
      user,
      desiredUser: desiredUser || null,
      movies: movies,
    },
  };
}

export default EditUser;
