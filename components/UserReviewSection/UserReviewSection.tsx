import {
  AspectRatio,
  chakra,
  Flex,
  Heading,
  Stack,
  Text,
  Link as ChakraLink,
  useBreakpoint,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { UserAuthType } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { ReviewActions } from '../MovieReviewSection/MovieReviewSection';

export const UserReviewSection: React.FC<{
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  user: UserAuthType;
}> = ({ movies, user }): React.ReactElement => {
  const bp = useBreakpoint();
  return (
    <Flex mt={5} maxW="6xl" width="full" direction="column">
      {movies.map((movie, i) => {
        const review = movie?.reviews?.find(
          (review) => review?.user?._id === user._id
        );
        if (!review) return null;
        return (
          <Flex
            mt={10}
            mx={{ base: 5, md: 0 }}
            maxWidth="6xl"
            key={i.toString()}
            direction={{ base: 'column', md: 'row' }}
            alignItems="center"
          >
            <AspectRatio
              ratio={16 / 9}
              minWidth="200px"
              mr={{ base: 0, md: 7 }}
            >
              <Image
                src={movie?.image || ''}
                alt={review?.user?.username + "'s profile"}
                layout="fill"
                className={'borderRadius-xl'}
              />
            </AspectRatio>
            <Flex direction="column" maxWidth="full">
              <Flex direction={{ base: 'column', md: 'row' }}>
                <Stack isInline>
                  <Link href={`/movie/${movie?._id}`} passHref>
                    <Heading
                      as={ChakraLink}
                      isTruncated
                      maxWidth={{ base: 'full', md: 'calc(100vw - 430px)' }}
                      size={['base', 'sm'].includes(bp || '') ? 'lg' : 'xl'}
                    >
                      {movie?.name}
                    </Heading>
                  </Link>
                  <Heading
                    size={['base', 'sm'].includes(bp || '') ? 'lg' : 'xl'}
                  >
                    {' '}
                    <chakra.span color="gray.500">
                      • {review?.rating.toFixed(1)}
                    </chakra.span>
                  </Heading>
                </Stack>

                {review && (
                  <ReviewActions
                    toInvalidate={'movies'}
                    movie={movie}
                    review={review}
                    user={user}
                  />
                )}
              </Flex>

              <Text
                fontSize={{ base: 'lg', md: '2xl' }}
                listStylePosition="inside"
              >
                <ReactMarkdown
                  skipHtml
                  disallowedElements={['img', 'a', 'code', 'pre']}
                >
                  {review?.comment || ''}
                </ReactMarkdown>
              </Text>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};
