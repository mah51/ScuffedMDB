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
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { ReviewActions } from 'components/ReviewSection/ReviewSection';
import { UserPageUser } from 'pages/user/[uID]';
import { SerializedRestaurantType } from 'models/restaurant';

export const UserReviewSection: React.FC<{
  movies?: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  restaurants?: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>[];
  books?: any;
  user: UserPageUser;
}> = ({ movies, user, restaurants, books}): React.ReactElement => {


  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const movieArr = movies ?? [];
      const restaurantArr = restaurants ?? [];
      const bookArr = books ?? [];
      const merged = [...movieArr, ...restaurantArr, ...bookArr];
      merged.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setData(merged);
    }
    catch (e) {
      console.error(e);
      setData([]);
      setError(true);
    }
  }, [movies, restaurants]);

  const getImage = (item) => {
    if (item?.movieID && item?.image){
      if (item?.image.includes('/null')){
        return `/svg/logo-no-background-${process.env.COLOR_THEME}.svg`;
      }
      return item?.image;
    }
    else if (item?.alias && item?.image_url){
      return item.image_url;
    }
    return '';
  }

  const getUrl = (item) => {
    if (item?.movieID){
      return `/movie/${item?._id}`
    }
    else if (item?.alias && item?.image_url){
      return `/restaurant/${item?._id}`
    }
    return '/';
  }

  const bp = useBreakpoint();
  return (
    <Flex mt={5} maxW="6xl" width="full" direction="column">
      {
        data && data?.map((item, i) => {
          const review = item?.reviews.find((review) => review?.user?._id === user._id);
          if (!review) return null;
          return (
            <Flex
              mt={10}
              width="92%"
              mx="auto"
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
                  src={getImage(item)}
                  alt={item.name}
                  layout="fill"
                  sizes="200px"
                  className={'borderRadius-xl'}
                />
              </AspectRatio>
              <Flex direction="column" maxWidth="full">
                <Flex direction={{ base: 'column', md: 'row' }}>
                  <Stack className='text-center md:text-left'>
                    <Link href={getUrl(item)} passHref>
                      <Heading
                        as={ChakraLink}
                        size={['base', 'sm'].includes(bp || '') ? 'lg' : 'xl'}
                      >
                        {item?.name}
                      </Heading>
                    </Link>
                    <Heading
                      size={['base', 'sm'].includes(bp || '') ? 'lg' : 'xl'}
                    >
                      {' '}
                      <chakra.span color="gray.500">
                        Rating: {review?.rating.toFixed(1)}
                      </chakra.span>
                    </Heading>
                  </Stack>
                  {bp === 'base' && (
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
                  )}
                  {review && (
                    <ReviewActions
                      centred
                      toInvalidate={item?.movieID ? 'movies' : 'restaurants'}
                      movie={item?.movieID ? item : null}
                      restaurant={item?.movieID ? null : item}
                      review={review}
                    />
                  )}
                </Flex>

                {bp !== 'base' && (
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
                )}
              </Flex>
            </Flex>
          )
        })
      }
      {
        error &&
        <Heading size={['base', 'sm'].includes(bp || '') ? 'sm' : 'md'} className='text-center' color='gray.500'>
          No Reviews Found...
        </Heading>
      }
    </Flex>
  );
};
