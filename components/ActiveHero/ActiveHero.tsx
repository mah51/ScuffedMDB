import {
  AspectRatio,
  Flex,
  Heading,
  Link as ChakraLink,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import { SerializedMovieType } from 'models/movie';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { ReactElement } from 'react';
import { ReviewModalContext } from 'utils/ModalContext';

interface Props {
  movie: SerializedMovieType | undefined;
}

export default function ActiveHero({ movie }: Props): ReactElement | null {
  const { colorMode } = useColorMode();

  const [session] = useSession();

  const { onOpen, setMovie } = useContext(ReviewModalContext);
  const hasReviewed = movie?.reviews?.some(
    (m) => m?.user?._id === session?.user.sub
  );
  if (!movie) return null;

  return (
    <Flex
      position="relative"
      direction="column"
      boxShadow="xl"
      mb="8"
      mx="auto"
      border="1px solid"
      borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
      borderRadius="2xl"
      p={5}
      px={7}
    >
      <Flex
        mx={-7}
        mt={-5}
        py={1}
        mb={5}
        borderTopRadius="2xl"
        fontWeight="bold"
        fontSize="2xl"
        justifyContent="center"
        bg={
          colorMode === 'light'
            ? `${process.env.COLOR_THEME}.200`
            : `${process.env.COLOR_THEME}.600`
        }
        borderBottom="1px solid"
        borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
      >
        Latest Movie
      </Flex>

      <Flex direction={{ base: 'column', md: 'row' }}>
        <AspectRatio ratio={16 / 9} minWidth="200px">
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
        mx={-7}
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
            _hover={{
              bg: transparentize(
                `gray.${colorMode === 'light' ? 500 : 200}`,
                0.16
              ),
            }}
            color={`${colorMode === 'light' ? 'gray.800' : 'white'}`}
            borderBottomLeftRadius="2xl"
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
          color={`${process.env.COLOR_THEME}.${
            colorMode === 'light' ? 500 : 300
          }`}
          _hover={{
            bg: transparentize(
              `${process.env.COLOR_THEME}.${colorMode === 'light' ? 500 : 200}`,
              0.16
            ),
          }}
          borderBottomRightRadius="2xl"
          width="50%"
          p={2}
        >
          {hasReviewed ? 'Edit review' : 'Add review'}
        </ChakraLink>
      </Flex>
    </Flex>
  );
}
