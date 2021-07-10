import React from 'react';
import { Flex, Heading, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { UserAuthType } from '../../types/next-auth/';

export const BannedPage: React.FC<{ user: UserAuthType }> = ({
  user,
}): React.ReactElement => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      overflow="hidden"
    >
      <Heading
        mb={6}
        fontSize={{ base: `4xl`, md: `6xl`, xl: `8xl` }}
        fontWeight="bold"
        lineHeight="none"
        letterSpacing={{ base: `normal`, md: `tight` }}
        color={useColorModeValue(`gray.900`, `gray.100`)}
      >
        <Text
          display={{ base: `block`, lg: `inline` }}
          w="full"
          bgClip="text"
          bgGradient="linear(to-r, green.400,purple.500)"
          fontWeight="extrabold"
        >
          You have been banned!
        </Text>
        {` `}
      </Heading>
      <Text
        fontSize={{ base: `xl`, md: `2xl` }}
        color={useColorModeValue(`gray.600`, `gray.300`)}
      >
        smh... you were banned with the following reason:
      </Text>

      <Text
        fontSize={{ base: `lg`, md: `xl` }}
        color={useColorModeValue(`gray.600`, `gray.300`)}
      >
        &quot;{user.banReason}&quot;
      </Text>
      <Text mt={3} color={useColorModeValue(`gray.600`, `gray.400`)}>
        If you want to dispute this contact Mikerophone#0001 on discord or
        create an issue on the{` `}
        <Link href="https://github.com/mah51/movie-web-typescript">
          github repo
        </Link>
        {` `}
      </Text>
    </Flex>
  );
};
