import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { UserType } from '../../models/user';
import { parseUser } from '../../utils/parseDiscordUser';
import { AppLayout } from '../../components/AppLayout';

interface EditUserProps {
  user: UserType;
  desiredUser: UserType;
}

function EditUser({ user, desiredUser }: EditUserProps) {
  console.log(desiredUser);
  return (
    <AppLayout user={user}>
      <Flex direction="column">
        {/* <UserSection /> */}
        <Flex>
          {/* <UserReviewSection /> */}
          {/* <UserStatsSection /> */}
        </Flex>
      </Flex>
    </AppLayout>
  );
}

export async function getServerSideProps(ctx) {
  const { uID } = ctx.query;
  const user: UserType = await parseUser(ctx);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/user/${uID}`,
  );
  const desiredUser = await response.json();
  return {
    props: {
      user,
      desiredUser,
    },
  };
}

export default EditUser;
