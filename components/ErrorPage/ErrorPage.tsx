import { Text, Divider, Flex, Heading, Link } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

interface Props {
  statusCode: number;
  message: string;
}

export default function ErrorPage({
  statusCode,
  message,
}: Props): ReactElement {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      height="100vh"
      width="100vw"
    >
      <Flex alignItems="center">
        <Heading>{statusCode}</Heading>
        <Divider
          mx={3}
          orientation="vertical"
          height="55px"
          alignSelf="stretch"
        />
        <Text>{message}</Text>
      </Flex>
      <Link color={'gray.500'} mt={10} href="/">
        Want to go home?
      </Link>
    </Flex>
  );
}
