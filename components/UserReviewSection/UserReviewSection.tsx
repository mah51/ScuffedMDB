import {
  AspectRatio,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { UserAuthType } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { ReviewActions } from '../MovieReviewSection/MovieReviewSection';

export const UserReviewSection: React.FC<{
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  user: UserAuthType;
}> = ({ movies, user }): React.ReactElement => {
  return (
    <Flex mt={5} maxW="6xl" width="full" direction="column">
      {movies.map((movie, i) => {
        const review = movie?.reviews?.find(
          (review) => review?.user?._id === user.sub
        );
        if (!review) return null;
        return (
          <Flex mt={10} width="6xl" key={i.toString()}>
            <AspectRatio ratio={16 / 9} minWidth="200px" mr={7}>
              <Image
                src={movie?.image}
                alt={review?.user?.username + "'s profile"}
                objectFit="fill"
                borderRadius="2xl"
              />
            </AspectRatio>
            <Flex direction="column" maxWidth="full">
              <Flex direction={{ base: 'column', md: 'row' }}>
                <Link href={`/movie/${movie?._id}`} passHref>
                  <Heading as="a">
                    {movie?.name}{' '}
                    <chakra.span color="gray.500">
                      • {review?.rating.toFixed(1)}
                    </chakra.span>
                  </Heading>
                </Link>
                {review && (
                  <ReviewActions
                    toInvalidate={'movies'}
                    movie={movie}
                    review={review}
                    user={user}
                  />
                )}
              </Flex>

              <Text fontSize="2xl">{review?.comment}</Text>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};
