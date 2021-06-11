import {
  AspectRatio,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import React from 'react';

export const UserReviewSection = ({ reviews }) => {
  return (
    <Flex mt={5} maxW="6xl" width="full" direction="column">
      {reviews.map((review, i) => (
        <Flex mt={10} width="6xl" key={i.toString()}>
          <AspectRatio ratio={16 / 9} minWidth="200px" mr={7}>
            <Image
              src={review.movie.image}
              objectFit="fill"
              borderRadius="2xl"
            />
          </AspectRatio>
          <Flex
            direction="column"
            maxWidth="full"
            overflowWrap="anywhere"
            overflow="hidden"
          >
            <Heading>
              {review.movie.name}{' '}
              <chakra.span color="gray.500">
                • {review.rating.toFixed(1)}
              </chakra.span>
            </Heading>
            <Text fontSize="2xl">{review.comment}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
