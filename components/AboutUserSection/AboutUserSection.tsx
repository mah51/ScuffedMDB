import React from 'react';
import {
  Avatar,
  Flex,
  Heading,
  chakra,
  VStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { PopulatedUserType } from '../../models/user';
import { ReviewType } from '../../models/movie';
import { UserPageUser } from 'pages/user/[uID]';

interface AboutUserSectionProps {
  user: UserPageUser;
  reviews: (
    | (ReviewType<PopulatedUserType> & {
        movie?: { name: string; image?: string };
      })
    | null
  )[];
}

export const AboutUserSection: React.FC<AboutUserSectionProps> = ({
  user,
  reviews,
}): React.ReactElement => {
  return (
    <Flex
      justifyContent="center"
      alignItems={{ base: 'center', md: 'flex-start' }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Avatar
        mr={{ base: 0, md: 10 }}
        size={useBreakpointValue({ base: 'xl', md: '2xl' })}
        src={user.image}
      />
      <VStack
        textAlign={{ base: 'center', md: 'left' }}
        alignItems={{ base: 'center', md: 'flex-start' }}
      >
        <Heading fontSize={{ base: '2xl', md: '5xl' }}>
          {user.username}
          <chakra.span color="gray.500" fontSize={{ base: 'lg', md: '2xl' }}>
            #{user.discriminator}
          </chakra.span>
        </Heading>
        <Text
          fontSize={{ base: 'lg', md: '2xl' }}
          color="gray.500"
          alignSelf={{ base: 'center', md: 'flex-start' }}
        >
          {reviews.length === 0 ? 'No reviews' : reviews.length + ' Rating'}
          {reviews.length > 1 ? 's' : ''}{' '}
          {reviews.length > 0 &&
            '·  ' +
              (
                reviews.reduce((a, c) => (c?.rating ? a + c?.rating : a), 0) /
                reviews.length
              ).toFixed(1) +
              '    Average Rating'}
        </Text>
      </VStack>
    </Flex>
  );
};
