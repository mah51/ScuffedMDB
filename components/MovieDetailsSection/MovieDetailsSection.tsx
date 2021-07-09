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
} from '@chakra-ui/react';
import { format } from 'date-fns';
import millify from 'millify';
import Link from 'next/link';

import Image from 'next/image';
import React, { ReactElement } from 'react';
import { FaImdb } from 'react-icons/fa';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import { getTotalCharCode } from '../../utils/utils';
import { IoChevronDown } from 'react-icons/io5';

import useScrollPosition from '../../hooks/useScrollPosition.hook';

interface Props {
  movie: MovieType<ReviewType<UserType>[]>;
  user: UserType;
}

export default function MovieDetailsSection({
  movie,
  user,
}: Props): ReactElement {
  const bp = useBreakpoint();
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const userReview = movie.reviews.find((rating) => rating.user.id === user.id);

  const averageReview =
    movie.reviews.length > 0
      ? (
          movie.reviews.reduce((a, c) => a + c.rating, 0) / movie.reviews.length
        ).toFixed(1)
      : false;
  const { scrollPosition } = useScrollPosition();

  return (
    <Box maxWidth="7xl" mx={'auto'}>
      <Flex
        direction="column"
        minHeight="calc(100vh - 80px)"
        width="full"
        justifyContent="flex-start"
      >
        {/* Scroll down section */}
        {!['base', 'sm', 'md'].includes(bp) && (
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

        <Flex
          mt={{ base: '5', md: 'calc(100vh / 9)' }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Flex
            width={{ base: '90%', lg: '50%' }}
            mx="auto"
            maxWidth="full"
            pr={{ base: 0, lg: '20px' }}
          >
            <AspectRatio
              borderRadius="xl"
              shadow={'6px 8px 19px 4px rgba(0, 0, 0, 0.25)'}
              ratio={16 / 9}
              width="full"
              height="full"
            >
              <Image
                className={'borderRadius-xl'}
                src={movie.image}
                alt={`${movie.name} poster`}
                layout="fill"
              ></Image>
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
                    colorScheme={`${
                      [
                        'red',
                        'orange',
                        'yellow',
                        'green',
                        'teal',
                        'blue',
                        'cyan',
                        'pink',
                        'purple',
                      ][getTotalCharCode(genre) % 9]
                    }`}
                  >
                    <TagLabel fontWeight={'600'}> {genre}</TagLabel>
                  </Tag>
                );
              })}
            </Stack>
            <Heading
              lineHeight="1.1em"
              transform={'translateX(-3px)'}
              fontSize="6xl"
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
                  <chakra.span fontSize="lg" fontWeight="bold" color={'white'}>
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
                  <chakra.span fontSize="lg" fontWeight="bold" color={'white'}>
                    {millify(movie.revenue)}
                  </chakra.span>
                </Text>
              </VStack>
            </Flex>
          </VStack>
        </Flex>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justifyContent="space-between"
          width="full"
          mt={'28'}
          textAlign={{ base: 'center', lg: 'left' }}
        >
          <StatGroup
            flexDirection={{ base: 'column', lg: 'row' }}
            alignItems="center"
            width="full"
          >
            <Stat>
              <StatLabel color={'gray.500'} fontSize="lg">
                Your Rating
              </StatLabel>
              <StatNumber fontSize="5xl" fontWeight="bold">
                {userReview ? (
                  <>
                    {userReview.rating}
                    <chakra.span
                      fontWeight="normal"
                      fontSize="xl"
                      color={'gray.500'}
                    >
                      {' '}
                      /10
                    </chakra.span>
                  </>
                ) : (
                  'N/A'
                )}
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel color={'gray.500'} fontSize="lg">
                Group Rating
              </StatLabel>
              <StatNumber fontSize="5xl" fontWeight="bold">
                {averageReview ? (
                  <>
                    {averageReview}
                    <chakra.span
                      fontSize="xl"
                      fontWeight="normal"
                      color={'gray.500'}
                    >
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
                <chakra.span
                  fontSize="xl"
                  fontWeight="normal"
                  color={'gray.500'}
                >
                  {' '}
                  /10
                </chakra.span>{' '}
                <chakra.span fontSize="xl">{movie.voteCount}</chakra.span>
                <chakra.span
                  fontSize="xl"
                  fontWeight="normal"
                  color={'gray.500'}
                >
                  {' '}
                  votes
                </chakra.span>
              </StatNumber>
            </Stat>
          </StatGroup>
          <Link href={`https://imdb.com/title/${movie.imdbID}`} passHref>
            <Button
              as={'a'}
              target="_blank"
              leftIcon={<FaImdb />}
              alignSelf="flex-end"
              colorScheme="yellow"
              variant="ghost"
              mx="auto"
            >
              View on IMDB
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
