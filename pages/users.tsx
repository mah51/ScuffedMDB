import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Flex, Heading, Text, useColorMode } from '@chakra-ui/react';
import { format } from 'date-fns';
import UserTable from '../components/UserTable';
import AppLayout from '../components/AppLayout';
import { getFlags } from '../utils/userFlags';
import { SerializedUser } from '../models/user';
import BannedPage from '../components/BannedPage';
import { NextSeo } from 'next-seo';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import dbConnect from '../utils/dbConnect';
import { getUsers } from '../utils/queries';
import { useQuery } from 'react-query';
import { Session } from 'next-auth';

interface UsersProps {
  users: SerializedUser[];
}

function Users({ users }: UsersProps): React.ReactNode {
  const { colorMode } = useColorMode();
  const [session, loading] = useSession();
  const router = useRouter();
  const { data } = useQuery(`users`, getUsers, { initialData: users });
  if (typeof window !== 'undefined' && loading) return null;

  if (!session) return router.push('/');

  const user = session.user;

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

        <Text
          color={colorMode === 'light' ? `gray.400` : `gray.600`}
          as="a"
          href="/"
        >
          Click to go to the homepage!
        </Text>
      </Flex>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const usrs = data?.map((usr: SerializedUser) => ({
    username: usr.username,
    discriminator: usr.discriminator,
    createdAt: format(new Date(usr.createdAt), `dd/MM/yy-HH:mm:ss`),
    image: usr.image,
    id: usr.discord_id,
    isBanned: usr.isBanned,
    banReason: usr.banReason,
    isAdmin: usr.isAdmin,
    isReviewer: usr.isReviewer,
    updatedAt: format(new Date(usr.updatedAt), `dd/MM/yy-HH:mm:ss`),
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

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{
  props: {
    session: Session | null;
    users: SerializedUser[];
  };
}> => {
  await dbConnect();

  const session = await getSession(ctx);
  if (!session || !session.user.isAdmin)
    return { props: { session, users: [] } };
  const users = await getUsers();

  return { props: { session, users } };
};

export default Users;
