import Image from 'next/image';
import {
  Box,
  Text,
  useColorModeValue,
  Flex,
  chakra,
  HStack,
  Tag,
  Skeleton,
  Avatar,
  AvatarGroup,
} from '@chakra-ui/react';
import Link from 'next/link';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import Rating from '../Rating';
import { PopulatedUserType } from '../../models/user';
import { getColorSchemeCharCode } from '../../utils/utils';
import { useState, useEffect } from 'react';
import restaurant from 'models/restaurant';

interface CardProps {
  movie?: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  featuredMovie?: string;
  restaurant?: any;
}

export const Card: React.FC<CardProps> = ({
  movie,
  featuredMovie,
  restaurant
}): React.ReactElement => {
  // const { image, name, genres, rating, numReviews, tagLine } = movie;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState();
  const [numReviews, setNumReviews] = useState();
  const [tagLine, setTagLine] = useState('');
  const [view, setView] = useState();
  const [isViewLoaded, setViewLoaded] = useState(false);

  useEffect(() => {
    if (movie) {
      movie.href = `/movie/${movie?._id}`;
      setView(movie);
      if (movie?.image?.includes('/null')) {
        setImage(undefined);
      }
      else {
        setImage(movie.image);
      }
      setName(movie.name);
      setGenres(movie.genres);
      setRating(movie.rating);
      setNumReviews(movie.numReviews);
      setTagLine(movie.tagLine);
    }
    else if (restaurant) {
      restaurant.href = `/restaurant/${restaurant?._id}`;
      setView(restaurant);
      setImage(restaurant.image_url);
      setName(restaurant.name);
      setGenres(restaurant?.categories.map((x) => x.title));
      setRating(restaurant.rating);
      setNumReviews(restaurant.numReviews);
      setTagLine(`${restaurant?.address[0]} ${restaurant?.address[1]}`);
    }
    setViewLoaded(true);
  }, [restaurant, movie])

  return (
    <Skeleton isLoaded={isViewLoaded} shallow={true}>
      <Link href={view?.href ?? ''} passHref>
        <Box as={'a'} height="full">
          <chakra.div
            position="relative"
            direction="column"
            maxW="400px"
            mx="auto"
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
              opacity={featuredMovie === view?._id ? 0.9 : 0}
              top={0}
              zIndex={10}
              left={0}
              right={0}
              bottom={0}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
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
                textAlign="center"
                fontSize="4xl"
                fontWeight="semibold"
                color={useColorModeValue(`gray.800`, `white`)}
              >
                View more
              </Text>
              {featuredMovie === view?._id && (
                <AvatarGroup mt={3} max={3}>
                  {view?.reviews?.map((review) => (
                    <Avatar key={review._id} src={review.user?.image} />
                  ))}
                </AvatarGroup>
              )}
            </Box>
            <Box mt={-6} mx={-6} mb={6} pos="relative">
              <Skeleton isLoaded={isImageLoaded}>
                <Image
                  src={image ? image : `/svg/logo-no-background-${process.env.COLOR_THEME}.svg`}
                  width="0"
                  onLoad={() => setIsImageLoaded(true)}
                  sizes="(max-width: 2561px) 400px"
                  height="0"
                  alt={`${view?.name} poster`}
                  className="w-[400px] h-[225px] object-cover"
                />
              </Skeleton>
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
                  {
                    (genres.length > 0) &&
                    <Tag
                      whiteSpace="nowrap"
                      ml="5px!important"
                      colorScheme={getColorSchemeCharCode(genres[0])}
                      fontWeight="600"
                      minW="auto"
                    >
                      {genres[0]}
                    </Tag>
                  }
                </Flex>
                <HStack
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mt={3}
                >
                  <Text color="gray.500">
                    {tagLine || 'No tag line :(...'}
                  </Text>

                  <Rating rating={rating} numReviews={numReviews} />
                </HStack>
              </Flex>
            </Flex>
          </chakra.div>
        </Box>
      </Link>
    </Skeleton>
  );
};
