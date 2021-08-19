import {
  AspectRatio,
  Flex,
  Heading,
  Link as ChakraLink,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { SerializedMovieType } from 'models/movie';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import Link from 'next/link';
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
      direction="column"
      mb="8"
      mx="auto"
      border="1px solid"
      borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
      borderRadius="2xl"
      p={5}
    >
      <Flex
        mx={-5}
        mt={-5}
        mb={5}
        borderTopRadius="2xl"
        fontWeight="bold"
        fontSize="2xl"
        justifyContent="center"
        color={
          colorMode === 'light'
            ? `${process.env.COLOR_THEME}.300`
            : `${process.env.COLOR_THEME}.500`
        }
        bg={colorMode === 'light' ? 'gray.800' : 'white'}
      >
        Active Movie
      </Flex>
      {/* <Box
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
      </Box> */}

      <Flex direction={{ base: 'column', md: 'row' }}>
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
          justifyContent="center"
        >
          <Heading>{movie.name}</Heading>
          <Text>{movie.tagLine}</Text>
        </VStack>
      </Flex>
      <Flex
        mt={5}
        mb={-5}
        mx={-5}
        borderBottomRadius="2xl"
        borderTop="1px solid"
        borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
        fontWeight="semibold"
        bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
        textAlign="center"
      >
        <Link href={`/movie/${movie._id}`} passHref>
          <ChakraLink
            width="50%"
            p={2}
            borderRight="1px solid"
            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
          >
            Details
          </ChakraLink>
        </Link>
        <ChakraLink
          as={'p'}
          onClick={() => {
            setMovie(movie);
            onOpen();
          }}
          width="50%"
          p={2}
        >
          {hasReviewed ? 'Edit review' : 'Add review'}
        </ChakraLink>
      </Flex>
    </Flex>
  );
}
