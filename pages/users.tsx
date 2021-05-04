import React from 'react';
import { GetServerSideProps } from 'next';
import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';

import { useQuery } from 'react-query';
import { parseUser } from '../utils/parseDiscordUser';
import { getUsers } from '../utils/queries';

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
  console.log(data);
  return (
    <Flex maxWidth="7xl" mx="auto">
      <Heading>All Users!</Heading>
      {data?.map((usr, i) => (
        <Text key={i.toString()}>{usr.username}</Text>
      ))}
    </Flex>
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
