import { useState } from 'react';
import {
  IconButton,
  Center,
  Flex,
  Text,
  VStack,
  Spinner,
  AspectRatio,
  Skeleton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import React from 'react';

function SkeletonImage({ result }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Skeleton isLoaded={imageLoaded} width="full" height="full">
      <Image
        onLoad={() => setImageLoaded(true)}
        alt={`${result?.name} poster`}
        layout="fill"
        src={`https://image.tmdb.org/t/p/original/${result.backdrop_path}`}
      />
    </Skeleton>
  );
}

export const SearchResults: React.FC<{
  data: any;
  loading: boolean;
  error: any;
  setSuccess: any;
  setError: any;
}> = ({ data, loading, error, setSuccess, setError }): React.ReactElement => {
  const addMovie = async (movieID) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URI}/api/movie/`,
      {
        method: `post`,
        body: JSON.stringify({ id: movieID }),
      }
    );
    const dta = await response.json();
    if (response.status === 200) {
      setSuccess(dta);
    } else {
      setError(dta.message);
    }
  };

  // eslint-disable-next-line no-nested-ternary
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
          key={index.toString()}
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
            <AspectRatio ratio={16 / 9} width="150px">
              <SkeletonImage result={result} key={index.toString()} />
            </AspectRatio>
          )}

          <Center margin="auto">
            <Text mx={8} textAlign="center">
              {result.title} - {new Date(result.release_date).getFullYear()}
            </Text>
          </Center>
        </Flex>
      ))}
    </VStack>
  );
};
