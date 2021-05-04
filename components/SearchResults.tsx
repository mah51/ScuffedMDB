import {
  Button,
  IconButton,
  Image,
  Box,
  Center,
  Flex,
  Text,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import axios from 'axios';
import React from 'react';

export const SearchResults = ({ data, loading, error }) => {
  const addMovie = async (movieID) => {
    await axios.post(`${process.env.NEXT_PUBLIC_APP_URI}/api/movie/`, {
      id: movieID,
    });
  };

  return loading ? (
    <Center>
      <Spinner
        mt={6}
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.200"
        size="xl"
      />
    </Center>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <VStack mt={10} spacing={4} align="stretch">
      {data.map((result, index) => (
        <Flex
          justifyContent="stretch"
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius={10}
          position="relative"
        >
          <IconButton
            size="sm"
            position="absolute"
            top={2}
            right={2}
            colorScheme="purple"
            aria-label="Search database"
            icon={<AddIcon />}
            onClick={async () => await addMovie(result.id)}
          />
          {result.backdrop_path && (
            <Image
              htmlWidth={150}
              objectFit="cover"
              src={`https://image.tmdb.org/t/p/original/${result.backdrop_path}`}
            />
          )}

          <Center margin="auto">
            <Text mx={8} textAlign="center">
              {result.title}
            </Text>
          </Center>
        </Flex>
      ))}
    </VStack>
  );
};
