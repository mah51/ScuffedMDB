import {
  Box,
  chakra,
  useColorModeValue,
  Button,
  Icon,
  Flex,
  useColorMode
} from '@chakra-ui/react';
import { signIn } from 'next-auth/client';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { SerializedMovieType } from '../../models/movie';
import { SerializedRestaurantType } from 'models/restaurant';
import Image from 'next/image';

export const LandingPage: React.FC<{
  movie?: SerializedMovieType;
  restaurant?: SerializedRestaurantType;
  desiredUser?: { username: string; image: string; _id: string };
}> = ({ movie, desiredUser, restaurant }): React.ReactElement => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { user: userID, movie: movieID, restaurant: restaurantID, review } = router.query;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URI}/${userID && movieID ? `?movie=${movieID}&user=${userID}` : ''
    }${userID && !movieID ? `?user=${userID}` : ''}${!userID && movieID ? `?movie=${movieID}` : ''
    }${restaurantID ? `?restaurant=${restaurantID}` : ''}${review ? `&review=${review}` : ''}`;
  return (
    <div className="h-screen bg-slate-950">
      <NextSeo
        title={movie?.name || restaurant?.name || desiredUser?.username || 'Welcome'}
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
              url: movie?.image || desiredUser?.image || `/sitePicture.jpg`,
              alt: siteName + ' webpage',
            },
          ],
        }}
        description={'A review website'}
      />
      <Flex
        flex={1}
        p={5}
        direction="row"
        align="center"
        justify="center"
      >
        <Box
          className=''
          w={{ base: `full`, md: 11 / 12, xl: 8 / 12 }}
          mx="auto"
          textAlign={{ base: `left`, sm: `center` }}
        >
          <Flex className='content-center items-center justify-center' alignItems='center' minH={{base:'60vh', md: '80vw'}}>
            <Image
              src={`/svg/logo-pink-landing.svg`}
              width={400}
              height={400}
              alt="Logo" />
          </Flex>
          <chakra.h1
            mb={6}
            fontSize={{ base: `4xl`, md: `6xl` }}
            lineHeight="none"
            letterSpacing={{ base: `normal`, md: `tight` }}
            w="full"
            bgClip="text"
            bgGradient="linear(to-r, pink.400,teal.500)"
            fontWeight="extrabold"
            className='text-center'
          >
            {siteName}
          </chakra.h1>
          <chakra.p
            px={{ base: 0, lg: 24 }}
            mb={6}
            fontSize={{ base: `lg`, md: `xl` }}
            color={useColorModeValue(`gray.600`, `gray.300`)}
          >
            {(movie || restaurant) && (
              <>
                <br />
                Sign in to see details about{' '}
                <chakra.span
                  fontWeight="semibold"
                  color={
                    colorMode === 'light'
                      ? `${process.env.COLOR_THEME}.500`
                      : `${process.env.COLOR_THEME}.300`
                  }
                >
                  {movie ? movie.name : restaurant?.name}
                </chakra.span>
              </>
            )}
            {desiredUser && (
              <>
                <br />
                Sign in to see{' '}
                <chakra.span
                  fontWeight="semibold"
                  color={
                    colorMode === 'light'
                      ? `${process.env.COLOR_THEME}.500`
                      : `${process.env.COLOR_THEME}.300`
                  }
                >
                  {desiredUser.username}&apos;s
                </chakra.span>{' '}
                reviews.
              </>
            )}
          </chakra.p>
          <Button
            variant="solid"
            color={useColorModeValue(
              `${process.env.COLOR_THEME}.700`,
              `${process.env.COLOR_THEME}.300`
            )}
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
    </div>
  );
};
