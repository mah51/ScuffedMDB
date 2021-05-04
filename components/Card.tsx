import Image from 'next/image';
import {
  Box,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  AvatarGroup,
  Flex,
  chakra,
} from '@chakra-ui/react';

import { MovieType } from '../models/movie';

interface CardProps extends MovieType {
  dateAdded: Date;
}

export const Card = ({
  image,
  name,
  reviews,
  rating,
  numReviews,
  dateAdded,
  tagLine,
  description,
}: CardProps) => (
  <chakra.div
    position="relative"
    direction="column"
    maxW="400px"
    w="full"
    bg={useColorModeValue(`white`, `gray.900`)}
    boxShadow="xl"
    rounded="md"
    transition="all 0.25s"
    transitionTimingFunction="spring(1 100 10 10)"
    p={6}
    _hover={{
      transform: `translateY(-4px)`,
      shadow: `2xl`,
    }}
    overflow="hidden"
  >
    <Box
      opacity={0}
      top={0}
      zIndex={10}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      transition="all 0.25s"
      bg={useColorModeValue(`white`, `gray.800`)}
      transitionTimingFunction="spring(1 100 10 10)"
      _hover={{
        opacity: 0.95,
        shadow: `2xl`,
      }}
    >
      <Text
        fontSize="4xl"
        fontWeight="semibold"
        color={useColorModeValue(`gray.800`, `white`)}
      >
        View more
      </Text>
    </Box>
    <Box mt={-6} mx={-6} mb={6} pos="relative">
      <Image src={image} layout="responsive" width="16px" height="9px" />
    </Box>

    <Flex isTruncated direction="column" justifyContent="space-between">
      <Stack isTruncated spacing={0}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text
            as="h3"
            color={useColorModeValue(`gray.700`, `white`)}
            fontSize="2xl"
            fontWeight="bold"
            isTruncated
          >
            {name}
          </Text>
          <chakra.span
            fontWeight="semibold"
            fontSize="md"
            ml={3}
            color={useColorModeValue(`gray.900`, `white`)}
          >
            {numReviews > 0 ? `${rating} / 10` : `No reviews`}
          </chakra.span>
        </Flex>

        <Text color="gray.500" isTruncated>
          {tagLine}
        </Text>
      </Stack>
      {numReviews > 0 && (
        <Flex mt={3}>
          <AvatarGroup size="md" max={4}>
            {reviews.map((review) => (
              <Avatar
                // @ts-ignore
                src={`https://cdn.discordapp.com/avatars/${review.user.id}/${review.user.avatar}`}
              />
            ))}
          </AvatarGroup>

          <Flex direction="column" alignSelf="stretch">
            <Text
              ml={2}
              my="auto"
              color={useColorModeValue(`gray.600`, `gray.300`)}
            >
              {` `}·{` `}
              {numReviews} reviews
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  </chakra.div>
);
