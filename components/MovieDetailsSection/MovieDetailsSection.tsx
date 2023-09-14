import {
  Flex,
  Box,
  AspectRatio,
  Tag,
  Stack,
  TagLabel,
  useMediaQuery,
  Heading,
  VStack,
  Text,
  chakra,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Icon,
  useBreakpoint,
  IconButton,
  useToast,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import millify from 'millify';
import Link from 'next/link';

import Image from 'next/image';
import React, { ReactElement, useContext, useState } from 'react';
import { FaImdb } from 'react-icons/fa';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { getColorSchemeCharCode } from '../../utils/utils';
import { IoChevronDown } from 'react-icons/io5';

import useScrollPosition from '../../hooks/useScrollPosition.hook';
import { AddIcon } from '@chakra-ui/icons';
import { ReviewModalContext } from '../../utils/ModalContext';
import { ExternalLinkIcon, EditIcon } from '@chakra-ui/icons';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { SettingsIcon } from '@chakra-ui/icons';
import { UserAuthType } from 'next-auth';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useEffect } from 'react';
import AdminOptions from '@components/AdminOptions';

interface Props {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  user: UserAuthType;
}
//TODO: Add SEO here
export default function MovieDetailsSection({
  movie,
  user,
}: Props): ReactElement {
  const bp = useBreakpoint();
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const userReview = movie.reviews.find(
    (rating) => rating?.user?._id === user.sub
  );
  const toast = useToast();
  const router = useRouter();
  const { review } = router.query;
  useEffect(() => {
    if (review && review === 'true') {
      if (user && user.isReviewer) {
        window.history.pushState({}, document.title, '/movie/' + movie._id); // removes ?review=true param from url so refresh does not open review modal.
        setModalMovie(movie);
        return reviewOnOpen();
      } else {
        toast({
          title: 'Not authorized',
          description: 'Review cannot be added as you are not a reviewer',
          duration: 5000,
          status: 'error',
          isClosable: true,
          variant: 'subtle',
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review, movie]);

  useEffect(() => {
    setIsImageLoaded(false);
  }, []);

  const averageReview =
    movie.reviews.length > 0
      ? (
        movie.reviews.reduce((a, c) => a + c.rating, 0) / movie.reviews.length
      ).toFixed(1)
      : false;
  const { scrollPosition } = useScrollPosition();

  const { onOpen: reviewOnOpen, setMovie: setModalMovie } = useContext(
    ReviewModalContext
  );

  return (
    <Flex maxWidth="7xl" mx={'auto'} mt="10px">
      <Flex
        direction="column"
        width="full"
        justifyContent="center"
        mt={{
          base: 'max(-80px,-1vh)',
          xl: '5vh',
          '2xl': '10vh',
          '4xl': '12em',
        }}
        mx={{
          lg: '2vw'
        }}
      >
        {/* Scroll down section */}
        {bp && !['base', 'sm', 'md'].includes(bp) && (
          <Flex
            direction="column"
            alignItems="center"
            position="absolute"
            bottom={'60px'}
            left={'50%'}
            transform={'translateX(-50%)'}
            color={'gray.500'}
            visibility={scrollPosition ? 'hidden' : 'visible'}
            opacity={scrollPosition ? 0 : 1}
            transition={'all 0.25s'}
          >
            <Text fontWeight="semibold">Scroll to see reviews</Text>
            <Icon
              className="bouncing-arrow"
              as={(props) => <IoChevronDown strokeWidth="20" {...props} />}
              height={6}
              mt={2}
              width={6}
            />
          </Flex>
        )}
        <Box minHeight="calc(100vh - 80px)">
          <AdminOptions user={user} movie={movie} />
          <Flex direction={{ base: 'column', lg: 'row' }}>
            <Flex
              width={{ base: '90%', lg: '50%' }}
              mx="auto"
              maxWidth="full"
              alignItems="center"
              pr={{ base: 0, lg: '20px' }}
            >
              <AspectRatio
                borderRadius="xl"
                shadow={'6px 8px 19px 4px rgba(0, 0, 0, 0.25)'}
                ratio={16 / 9}
                width="full"
              >
                <Skeleton borderRadius="xl" isLoaded={isImageLoaded}>
                  <Image
                    className={'borderRadius-xl'}
                    src={movie?.image || ''}
                    alt={`${movie.name} poster`}
                    sizes={'50vw'}
                    layout="fill"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </Skeleton>
              </AspectRatio>
            </Flex>
            <VStack
              mx="auto"
              pl={{ base: 0, lg: '20px' }}
              alignItems="flex-start"
              maxWidth={{ base: '90%', lg: '50%' }}
            >
              <Stack spacing={3} mt={{ base: '5', lg: 0 }} isInline>
                {movie?.genres?.slice(0, 4).map((genre, i) => {
                  return (
                    <Tag
                      size={isLargerThan800 ? 'md' : 'sm'}
                      key={i.toString()}
                      colorScheme={getColorSchemeCharCode(genre)}
                    >
                      <TagLabel fontWeight={'600'}> {genre}</TagLabel>
                    </Tag>
                  );
                })}
              </Stack>
              <Heading
                lineHeight="1.1em"
                transform={'translateX(-3px)'}
                fontSize={{
                  'base': '4xl',
                  'lg': '6xl'
                }}
              >
                {movie.name}
              </Heading>
              <Text
                fontSize="lg"
                fontStyle="italic"
                color={'gray.500'}
                fontWeight="bold"
              >
                {movie.tagLine}
              </Text>
              <Text fontSize="lg">{movie.description}</Text>
              <Flex
                justifyContent="space-between"
                width="full"
                mt={{ base: '20px!important', lg: 'auto!important' }}
              >
                <VStack spacing={1}>
                  <Text color={'gray.500'} fontSize="sm">
                    Release Date
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {format(new Date(movie.releaseDate), 'MMM yyyy')}
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text color={'gray.500'} fontSize="sm">
                    Runtime
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    {movie.runtime}{' '}
                    <chakra.span
                      color={'gray.500'}
                      fontWeight="normal"
                      fontSize="sm"
                    >
                      mins
                    </chakra.span>
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text color={'gray.500'} fontSize="sm">
                    Budget
                  </Text>
                  <Text color={'gray.500'} fontSize="sm">
                    $
                    <chakra.span
                      fontSize="lg"
                      fontWeight="bold"
                      color={useColorModeValue('gray.900', 'white')}
                    >
                      {millify(movie.budget)}
                    </chakra.span>
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text color={'gray.500'} fontSize="sm">
                    Revenue
                  </Text>
                  <Text color={'gray.500'} fontSize="sm">
                    $
                    <chakra.span
                      fontSize="lg"
                      fontWeight="bold"
                      color={useColorModeValue('gray.900', 'white')}
                    >
                      {millify(movie.revenue)}
                    </chakra.span>
                  </Text>
                </VStack>
              </Flex>
            </VStack>
          </Flex>
          {bp === '4xl' && (
            <AdditionalMovieDetails
              {...{
                userReview,
                user,
                setModalMovie,
                reviewOnOpen,
                movie,
                averageReview,
              }}
            />
          )}
        </Box>
        {bp !== '4xl' && (
          <AdditionalMovieDetails
            {...{
              userReview,
              user,
              setModalMovie,
              reviewOnOpen,
              movie,
              averageReview,
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}

const AdditionalMovieDetails = ({
  userReview,
  user,
  setModalMovie,
  reviewOnOpen,
  movie,
  averageReview,
}: {
  userReview?: ReviewType<PopulatedUserType>;
  user?: UserAuthType;
  setModalMovie: (x: any) => void;
  reviewOnOpen: () => void;
  movie: SerializedMovieType;
  averageReview: string | boolean;
}) => (
  <Flex
    direction={{ base: 'column', lg: 'row' }}
    justifyContent="space-between"
    width="full"
    mt={'28'}
    textAlign={{ base: 'center', lg: 'left' }}
  >
    <StatGroup
      flexDirection={{ base: 'column', lg: 'row' }}
      alignItems="stretch"
      justifyContent="space-between"
      width="full"
      textAlign="center"
    >
      <Stat>
        <StatLabel color={'gray.500'} fontSize="lg">
          Your Rating
        </StatLabel>
        <StatNumber fontSize="5xl" fontWeight="bold">
          {userReview ? (
            <>
              {userReview.rating}
              <chakra.span fontWeight="normal" fontSize="xl" color={'gray.500'}>
                {' '}
                /10
              </chakra.span>
            </>
          ) : (
            <>
              {user?.isReviewer ? (
                <Button
                  variant="solid"
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    setModalMovie(movie);
                    return reviewOnOpen();
                  }}
                  colorScheme={process.env.COLOR_THEME}
                >
                  Add one!
                </Button>
              ) : (
                <Text>N/A</Text>
              )}
            </>
          )}
        </StatNumber>
      </Stat>

      <Stat>
        <StatLabel color={'gray.500'} fontSize="lg">
          Group Rating
        </StatLabel>
        <StatNumber fontSize={'5xl'} fontWeight="bold">
          {averageReview ? (
            <>
              {averageReview}
              <chakra.span fontSize="xl" fontWeight="normal" color={'gray.500'}>
                {' '}
                /10
              </chakra.span>
            </>
          ) : (
            'No reviews'
          )}
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel color={'gray.500'} fontSize="lg">
          World Wide Rating
        </StatLabel>
        <StatNumber fontSize="5xl" fontWeight="bold">
          {movie.voteAverage}
          <chakra.span fontSize="xl" fontWeight="normal" color={'gray.500'}>
            {' '}
            /10
          </chakra.span>{' '}
          <chakra.span fontSize="xl">{millify(movie.voteCount)}</chakra.span>
          <chakra.span fontSize="xl" fontWeight="normal" color={'gray.500'}>
            {' '}
            votes
          </chakra.span>
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel color={'gray.500'} fontSize="lg">
          View on IMDB
        </StatLabel>
        <StatNumber position="relative" fontSize="5xl" fontWeight="bold">
          <chakra.span visibility={'hidden'} aria-hidden="true">
            H
          </chakra.span>

          <Link href={`https://imdb.com/title/${movie.imdbID}`} passHref>
            <IconButton
              position={'absolute'}
              top={'50%'}
              left={'50%'}
              transform={'translate(-50%, -50%)'}
              mt={'auto'}
              aria-label="View on IMDB"
              size="xl"
              p={2}
              as={'a'}
              target="_blank"
              icon={<FaImdb size="1em" />}
              alignSelf="flex-end"
              variant="IMDB"
            />
          </Link>
        </StatNumber>
      </Stat>
    </StatGroup>
  </Flex>
);