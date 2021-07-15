import React from 'react';
import { Avatar, Flex, Heading, chakra, VStack, Text } from '@chakra-ui/react';
import { UserType } from '../../models/user';
import { ReviewType } from '../../models/movie';

interface AboutUserSectionProps {
  user: UserType;
  reviews: ReviewType[];
}

export const AboutUserSection: React.FC<AboutUserSectionProps> = ({
  user,
  reviews,
}): React.ReactElement => {
  return (
    <Flex justifyContent="center">
      <Avatar mr={10} size="2xl" src={user.image} />
      <VStack textAlign="left" alignItems="flex-start">
        <Heading size="3xl">
          {user.username}
          <chakra.span color="gray.500" fontSize="2xl">
            #{user.discriminator}
          </chakra.span>
        </Heading>
        <Text fontSize="2xl" color="gray.500" alignSelf="flex-start">
          {reviews.length === 0 ? 'No reviews' : reviews.length + ' Rating'}
          {reviews.length > 1 ? 's' : ''}{' '}
          {reviews.length > 0 &&
            '·  ' +
              (
                reviews.reduce((a, c) => a + c.rating, 0) / reviews.length
              ).toFixed(1) +
              '    Average Rating'}
        </Text>
      </VStack>
    </Flex>
  );
};
