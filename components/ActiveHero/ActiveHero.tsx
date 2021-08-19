import {
  AspectRatio,
  Flex,
  Heading,
  Tag,
  Box,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { SerializedMovieType } from 'models/movie';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import React, { useContext } from 'react';
import { ReactElement } from 'react';
import { ReviewModalContext } from 'utils/ModalContext';

interface Props {
  movie: SerializedMovieType;
}

export default function ActiveHero({ movie }: Props): ReactElement | null {
  const { colorMode } = useColorMode();

  const [session] = useSession();

  const { onOpen, setMovie } = useContext(ReviewModalContext);
  const hasReviewed = movie.reviews.some(
    (m) => m.user?._id === session?.user.sub
  );
  if (!movie) return null;

  return (
    <Flex
      position="relative"
      mt="5"
      direction={{ base: 'column', md: 'row' }}
      mx="auto"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      border="1px solid"
      borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
      borderRadius="2xl"
      p={5}
    >
      <Box
        opacity={0}
        top={0}
        zIndex={10}
        left={0}
        right={0}
        bottom={0}
        borderRadius="2xl"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        transition="all 0.25s"
        bg={colorMode === 'light' ? `white` : `gray.800`}
        transitionTimingFunction="spring(1 100 10 10)"
        onClick={() => {
          setMovie(movie);
          onOpen();
        }}
        _hover={{
          opacity: 0.955,
          cursor: 'pointer',
          shadow: `2xl`,
        }}
      >
        <Text
          fontSize="4xl"
          fontWeight="semibold"
          textAlign="center"
          color={colorMode === 'light' ? `gray.800` : `white`}
        >
          {hasReviewed ? 'Edit your review' : 'Add a review'}
        </Text>
      </Box>

      <AspectRatio mt={{ base: 7, md: 0 }} ratio={16 / 9} minWidth="200px">
        <Image
          className={'borderRadius-2xl'}
          src={movie.image || ''}
          layout="fill"
          sizes={'30vw'}
          alt={`${movie.name} `}
        />
      </AspectRatio>

      <VStack
        ml={{ base: 0, md: 6 }}
        mt={{ base: 3, md: 0 }}
        textColor={colorMode === 'light' ? 'gray.800' : 'white'}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Tag mt={-1} alignSelf="flex-end" colorScheme="green">
          Active Movie
        </Tag>
        <Heading>{movie.name}</Heading>
        <Text>{movie.tagLine}</Text>
      </VStack>
    </Flex>
  );
}
