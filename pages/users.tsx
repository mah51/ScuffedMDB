import React, { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
  Button,
  chakra,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import UserTable from '../components/UserTable';
import AppLayout from '../components/AppLayout';
import { SerializedUser } from '../models/user';
import { NextSeo } from 'next-seo';
import { getSession, useSession } from 'next-auth/client';
import dbConnect from '../utils/dbConnect';
import { getUsers } from '../utils/queries';
import { useQuery } from 'react-query';
import { Session } from 'next-auth';
import Wave from '../components/Wave';
import { BiChevronDown } from 'react-icons/bi';

interface UsersProps {
  users: SerializedUser[];
}

function Users({ users }: UsersProps): React.ReactNode {
  const [session, loading] = useSession();
  const [sort, setSort] = useState('recent');
  const { data } = useQuery(`users`, getUsers, { initialData: users });

  if ((typeof window !== 'undefined' && loading) || !session) return null;

  let sortedUsers = data?.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  if (sort === 'recent') {
    sortedUsers = sortedUsers?.reverse();
  }

  return (
    <>
      <NextSeo title="Users" />
      <AppLayout user={session?.user}>
        <Flex
          maxWidth="7xl"
          mx="auto"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading mb={10} mx="auto" size="2xl">
            All Users
          </Heading>
          <Wave mb={10} width="max(20%, 150px)" />
          <chakra.div>
            <Menu>
              <MenuButton mb={5} as={Button} rightIcon={<BiChevronDown />}>
                Sort by...
              </MenuButton>
              <MenuList zIndex={998}>
                <MenuItem
                  zIndex={999}
                  isDisabled={sort === 'recent'}
                  onClick={() => setSort('recent')}
                >
                  Recent
                </MenuItem>
                <MenuItem
                  zIndex={999}
                  isDisabled={sort === 'old'}
                  onClick={() => setSort('old')}
                >
                  Old
                </MenuItem>
              </MenuList>
            </Menu>
          </chakra.div>
          <UserTable users={sortedUsers} />
        </Flex>
      </AppLayout>
    </>
  );
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<
  | {
      props: {
        session: Session | null;
        users: SerializedUser[];
      };
    }
  | {
      redirect: {
        destination: '/';
        permanent: false;
      };
    }
> => {
  await dbConnect();
  const session = await getSession(ctx);
  if (!session || !session.user.isAdmin || session.user.isBanned)
    return { redirect: { destination: '/', permanent: false } };
  const users = await getUsers();

  return { props: { session, users } };
};

export default Users;
