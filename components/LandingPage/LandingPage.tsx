import {
  Box,
  chakra,
  useColorModeValue,
  Text,
  Button,
  Icon,
  Flex,
  useColorMode,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/client';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { SerializedMovieType } from '../../models/movie';

export const LandingPage: React.FC<{
  movie?: SerializedMovieType;
  desiredUser?: { username: string; image: string; _id: string };
}> = ({ movie, desiredUser }): React.ReactElement => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { user: userID, movie: movieID } = router.query;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URI}/${
    userID && movieID ? `?movie=${movieID}&user=${userID}` : ''
  }${userID && !movieID ? `?user=${userID}` : ''}${
    !userID && movieID ? `?movie=${movieID}` : ''
  }`;

  return (
    <>
      <NextSeo
        title={movie?.name || desiredUser?.username || 'Welcome'}
        openGraph={{
          title: movie?.name
            ? `${movie?.name} on ${siteName}`
            : desiredUser?.username
            ? `${desiredUser?.username} on ${siteName}`
            : 'Welcome',
          type: `website`,
          site_name: siteName,
          images: [
            {
              width: 1920,
              height: 1080,
              url:
                movie?.image ||
                desiredUser?.image ||
                `https://www.movie.michael-hall.me/sitePicture.png`,
              alt: siteName + ' webpage',
            },
          ],
        }}
        description={movie?.description || 'A private movie rating website'}
      />
      <Flex
        minH="100vh"
        flex={1}
        p={5}
        direction="row"
        align="center"
        justify="center"
      >
        <Box
          w={{ base: `full`, md: 11 / 12, xl: 8 / 12 }}
          mx="auto"
          textAlign={{ base: `left`, sm: `center` }}
        >
          <chakra.h1
            mb={6}
            fontSize={{ base: `4xl`, md: `6xl` }}
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
              {siteName}
            </Text>
            {` `}
          </chakra.h1>
          <chakra.p
            px={{ base: 0, lg: 24 }}
            mb={6}
            fontSize={{ base: `lg`, md: `xl` }}
            color={useColorModeValue(`gray.600`, `gray.300`)}
          >
            The website where cool kids write movie reviews :).
            {movie && (
              <>
                <br />
                Sign in to see details about{' '}
                <chakra.span
                  fontWeight="semibold"
                  color={colorMode === 'light' ? 'purple.500' : 'purple.300'}
                >
                  {movie.name}
                </chakra.span>
              </>
            )}
          </chakra.p>
          <Button
            variant="solid"
            color={useColorModeValue(`purple.700`, `purple.300`)}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: `full`, sm: `auto` }}
            mb={{ base: 2, sm: 0 }}
            // as="a"
            // href="/api/oauth"
            onClick={(e) => {
              e.preventDefault();
              signIn('discord', {
                callbackUrl,
              });
            }}
            size="lg"
          >
            Log in with discord
            <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </Icon>
          </Button>
        </Box>
      </Flex>
    </>
  );
};
