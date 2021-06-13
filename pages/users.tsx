import React from 'react';
import { GetServerSideProps } from 'next';
import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';

import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { parseUser } from '../utils/parseDiscordUser';
import { getUsers } from '../utils/queries';
import UserTable from '../components/UserTable';
import AppLayout from '../components/AppLayout';
import { getFlags } from '../utils/userFlags';
import { UserType } from '../models/user';
import BannedPage from '../components/BannedPage';
import { NextSeo } from 'next-seo';

interface UsersProps {
  user: UserType;
  users: UserType[];
}

function Users({ user, users }: UsersProps): React.ReactChild {
  if (user?.isBanned) {
    return <BannedPage user={user} />;
  }
  if (!user || !user.isAdmin) {
    return (
      <Flex
        height="full"
        width="full"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Heading>You are not authorized to view this page 😢</Heading>

        <Text color={useColorModeValue(`gray.400`, `gray.600`)} as="a" href="/">
          Click to go to the homepage!
        </Text>
      </Flex>
    );
  }

  const { data } = useQuery(`users`, getUsers, { initialData: users });
  const usrs = data.map((usr: UserType) => ({
    username: usr.username,
    discriminator: usr.discriminator,
    createdAt: format(new Date(usr.createdAt), `dd/MM/yy-HH:mm:ss`),
    image: usr.avatar
      ? `https://cdn.discordapp.com/avatars/${usr.id}/${usr.avatar}.jpg`
      : user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`
      : `https://cdn.discordapp.com/embed/avatars/${
          Number(user.discriminator) % 5
        }.png`,
    id: usr.id,
    isBanned: usr.isBanned,
    banReason: usr.banReason,
    isAdmin: usr.isAdmin,
    isReviewer: usr.isReviewer,
    updatedAt: format(new Date(usr.last_updated), `dd/MM/yy-HH:mm:ss`),
    flags: getFlags(usr.public_flags),
    // eslint-disable-next-line no-underscore-dangle
    _id: usr._id,
  }));
  return (
    <>
      <NextSeo title="Users" />
      <AppLayout user={user}>
        <Flex maxWidth="7xl" mx="auto" direction="column" alignItems="center">
          <Heading mb={10}>All Users</Heading>
          <UserTable data={usrs} />
        </Flex>
      </AppLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user: UserType = await parseUser(ctx);
  if (!user) {
    return { props: { user: null } };
  }
  const users = await getUsers();
  return { props: { user, users } };
};

export default Users;
