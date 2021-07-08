import {
  Flex,
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
  StatHelpText,
  StatArrow,
  StatNumber,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import millify from 'millify';

import Image from 'next/image';
import React, { ReactElement } from 'react';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import { getTotalCharCode } from '../../utils/utils';

interface Props {
  movie: MovieType<ReviewType<UserType>[]>;
  user: UserType;
}

export default function MovieDetailsSection({
  movie,
  user,
}: Props): ReactElement {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const userReview = movie.reviews.find((rating) => rating.user.id === user.id);

  const averageReview =
    movie.reviews.length > 0
      ? (
          movie.reviews.reduce((a, c) => a + c.rating, 0) / movie.reviews.length
        ).toFixed(1)
      : false;
  return (
    <Flex
      direction="column"
      maxWidth="7xl"
      width="full"
      mx={'auto'}
      height="100vh"
      justifyContent="flex-start"
    >
      <Flex mt={{ base: '5', md: '40' }}>
        <Flex width="50%" maxWidth="full" pr={'20px'}>
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
        <VStack pl={'20px'} alignItems="flex-start" maxWidth="50%">
          <Stack spacing={3} isInline>
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
          <Heading fontSize="6xl">{movie.name}</Heading>
          <Text fontSize="lg">{movie.description}</Text>
          <Flex
            justifyContent="space-between"
            width="full"
            mt={'auto!important'}
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
      <Flex justifyContent="space-between" width="full" mt={'28'}>
        <StatGroup width="full">
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
              <chakra.span fontSize="xl" fontWeight="normal" color={'gray.500'}>
                {' '}
                /10
              </chakra.span>{' '}
              <chakra.span fontSize="xl">{movie.voteCount}</chakra.span>
              <chakra.span fontSize="xl" fontWeight="normal" color={'gray.500'}>
                {' '}
                votes
              </chakra.span>
            </StatNumber>
          </Stat>
        </StatGroup>
      </Flex>
    </Flex>
  );
}
