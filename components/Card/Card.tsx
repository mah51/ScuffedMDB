import Image from 'next/image';
import {
  Box,
  Text,
  useColorModeValue,
  Flex,
  chakra,
  HStack,
  Tag,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import Rating from '../Rating';
import { PopulatedUserType } from '../../models/user';
import { getColorSchemeCharCode } from '../../utils/utils';

interface CardProps {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
}

export const Card: React.FC<CardProps> = ({ movie }): React.ReactElement => {
  const { image, name, genres, rating, numReviews, tagLine } = movie;
  return (
    <Link href={`/movie/${movie._id}`} passHref>
      <Box as={'a'} height="full">
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
            cursor: 'pointer',
          }}
          overflow="hidden"
          height="full"
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
            {image && (
              <Image
                src={image}
                layout="responsive"
                width="400px"
                // sizes={imageSizesOnWidthAndBreakpoints(400, bpsAsObjectPx)}
                sizes="(max-width: 2561px) 400px"
                height="225px"
                alt={`${movie?.name} poster`}
              />
            )}
          </Box>

          <Flex direction="column" justifyContent="space-between">
            <Flex direction={'column'}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                maxW="full"
              >
                <Text
                  as="h3"
                  color={useColorModeValue(`gray.700`, `white`)}
                  fontSize="2xl"
                  fontWeight="bold"
                  maxW="full"
                  isTruncated
                >
                  {name}
                </Text>
                <Tag
                  colorScheme={getColorSchemeCharCode(genres[0])}
                  fontWeight="600"
                  minW="auto"
                >
                  {genres[0]}
                </Tag>
              </Flex>
              <HStack
                justifyContent="space-between"
                alignItems="flex-start"
                mt={3}
              >
                <Text color="gray.500" isTruncated>
                  {tagLine || 'No tag line :(...'}
                </Text>

                <Rating rating={rating} numReviews={numReviews} />
              </HStack>
            </Flex>
          </Flex>
        </chakra.div>
      </Box>
    </Link>
  );
};
