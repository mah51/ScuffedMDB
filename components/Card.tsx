import Image from 'next/image';
import {
  Box,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  AvatarGroup,
  Divider,
} from '@chakra-ui/react';
import moment from 'moment';
import { Flex } from '@chakra-ui/layout';

interface CardProps {
  image: string;
  name: string;
  rating: number;
  numRatings: number;
  dateAdded: number;
  reviews: any;
  description: string;
  tagLine: string;
}

export const Card = ({
  image,
  name,
  reviews,
  rating,
  numRatings,
  dateAdded,
  tagLine,
  description,
}: CardProps) => (
  <Box
    position="relative"
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
      rounded="md"
      opacity={0}
      top={0}
      zIndex={999}
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
        opacity: 0.9,
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
    <Box h="210px" bg="gray.100" mt={-6} mx={-6} mb={6} pos="relative">
      <Image src={image} layout="fill" />
    </Box>

    <Stack isTruncated>
      <Flex isTruncated alignItems="center" justifyContent="space-between">
        <Heading
          color={useColorModeValue(`gray.700`, `white`)}
          fontSize="2xl"
          fontFamily="body"
          isTruncated
        >
          {name}
        </Heading>
        <Box ml={3}>
          <AvatarGroup size="md" max={5}>
            {reviews.map((review) => (
              <Avatar
                name={review.username}
                src={`https://cdn.discordapp.com/avatars/${review.id}/${review.avatar}`}
              />
            ))}
          </AvatarGroup>

          <Text fontWeight={600}>
            {rating} · {numRatings} reviews
          </Text>
        </Box>
      </Flex>
      <Text mt={2} color="gray.500" isTruncated>
        {tagLine}
      </Text>
    </Stack>
  </Box>
);
