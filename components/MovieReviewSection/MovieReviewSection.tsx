import {
  VStack,
  Heading,
  Box,
  Flex,
  Avatar,
  chakra,
  Text,
  IconButton,
  Stack,
  Tooltip,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
} from '@chakra-ui/react';
import { PopulatedUserType } from '../../models/user';
import React, { ReactElement } from 'react';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import Wave from '../Wave';
import { UserAuthType } from 'next-auth';
import { EditIcon } from '@chakra-ui/icons';
import { DeleteIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { ReviewModalContext } from '../../utils/ModalContext';
import { useQueryClient } from 'react-query';

interface Props {
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
  user: UserAuthType;
}

interface ReviewActionsProps extends ReviewProps {
  toInvalidate?: string;
}

export const ReviewActions = ({
  review,
  user,
  toInvalidate,
  movie,
}: ReviewActionsProps): JSX.Element | null => {
  const toast = useToast();
  const { setMovie, onOpen } = useContext(ReviewModalContext);
  const queryClient = useQueryClient();
  const handleReviewDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const response = await fetch(`/api/review`, {
      method: 'DELETE',

      body: JSON.stringify({
        movieID: movie._id,
        reviewID: review._id,
      }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      return toast({
        title: 'There was an error deleting that review...',
        description: data.message,
        status: 'error',
        variant: 'subtle',
      });
    } else {
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted',
        status: 'success',
        variant: 'subtle',
      });
      await queryClient.invalidateQueries(toInvalidate || `movie`);
    }
  };
  if (review?.user?._id === user.sub || user?.isAdmin) {
    return (
      <Stack isInline ml={3}>
        <Tooltip placement="top" label="Edit your review">
          <IconButton
            icon={<EditIcon />}
            aria-label="Edit review"
            colorScheme="purple"
            variant="ghost"
            onClick={() => {
              setMovie(movie);
              onOpen();
            }}
          />
        </Tooltip>

        <Popover>
          <Tooltip
            placement="top"
            label={`Delete ${
              review.user?._id === user.id
                ? 'your'
                : review.user?.username + "'s"
            } review`}
          >
            <span>
              <PopoverTrigger>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete review"
                  colorScheme="red"
                  variant="ghost"
                />
              </PopoverTrigger>
            </span>
          </Tooltip>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Are you sure?</PopoverHeader>
            <PopoverBody>
              Deleting this review is irreversible!
              <Stack isInline ml="auto">
                <Button
                  size="sm"
                  ml="auto"
                  mt="2"
                  colorScheme="red"
                  onClick={handleReviewDelete}
                >
                  Delete
                </Button>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Stack>
    );
  }
  return null;
};

interface ReviewProps {
  user: UserAuthType;
  review: ReviewType<PopulatedUserType>;
  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
}
const Review = ({ review, user, movie }: ReviewProps) => {
  return (
    <VStack mt={8} alignItems="flex-start" spacing={3} px={4}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        width="full"
        alignItems="center"
      >
        <Avatar size="lg" src={review?.user?.image} />
        <chakra.div display="flex" alignItems="center">
          <Heading size="2xl" ml={5} maxWidth="full">
            {review?.user?.username}
            <chakra.span color={'gray.500'} fontWeight="semibold" fontSize="lg">
              {' '}
              #{review?.user?.discriminator}
            </chakra.span>
          </Heading>
          <ReviewActions review={review} movie={movie} user={user} />
        </chakra.div>
        <chakra.div
          display="flex"
          ml={{ base: 0, lg: 'auto' }}
          alignItems="center"
        >
          <Text fontSize="4xl" fontWeight="bold">
            {review.rating}
            <chakra.span color={'gray.500'} fontWeight="semibold" fontSize="lg">
              {' '}
              /10
            </chakra.span>
          </Text>
        </chakra.div>
      </Flex>
      <Text fontSize="lg" color={review?.comment ? 'white' : 'gray.500'}>
        {review.comment || 'No comment'}
      </Text>
    </VStack>
  );
};

export default function MovieReviewSection({
  movie,
  user,
}: Props): ReactElement {
  return (
    <Box maxWidth="7xl" mx={'auto'} mb={40}>
      <VStack alignItems="center" spacing={3} mt={{ base: 28, lg: 0 }}>
        <Wave mx="auto" width={{ base: '70%', md: '30%' }} />
        <Heading fontSize="6xl">
          {movie.reviews.length} Review{movie.reviews.length !== 1 && 's'}
        </Heading>
        <Wave
          mt={'15px!important'}
          mx="auto!important"
          width={{ base: '70%', md: '30%' }}
        />
      </VStack>
      <Flex mt={10} direction="column">
        {movie.reviews.map((review: ReviewType<PopulatedUserType>, i) => (
          <Review
            movie={movie}
            review={review}
            user={user}
            key={i.toString()}
          />
        ))}
      </Flex>
    </Box>
  );
}
