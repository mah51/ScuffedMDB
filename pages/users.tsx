import React from 'react';
import { GetServerSideProps } from 'next';
import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';

import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { parseUser } from '../utils/parseDiscordUser';
import { getUsers } from '../utils/queries';
import UserTable from '../components/UserTable';
import { AppLayout } from '../components/AppLayout';
import { getFlags } from '../utils/userFlags';

function Users({ user, users }) {
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
  const usrs = data.map((usr) => ({
    username: `${usr.username}#${usr.discriminator}`,
    createdAt: format(new Date(usr.createdAt), `dd/MM/yy-HH:mm:ss`),
    image: `https://cdn.discordapp.com/avatars/${usr.id}/${usr.avatar}.jpg`,
    id: usr.id,
    updatedAt: format(new Date(usr.updatedAt), `dd/MM/yy-HH:mm:ss`),
    flags: getFlags(user.public_flags),
  }));
  return (
    <AppLayout user={user}>
      <Flex maxWidth="7xl" mx="auto" direction="column" alignItems="center">
        <Heading>All Users</Heading>
        <UserTable data={usrs} />
      </Flex>
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = parseUser(ctx);
  if (!user) {
    return { props: { user: null } };
  }
  const users = await getUsers();
  return { props: { user, users } };
};

export default Users;
