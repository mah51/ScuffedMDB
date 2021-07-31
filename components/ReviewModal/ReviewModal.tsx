import React, { useState, useEffect, useContext } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  useColorModeValue,
  Flex,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  useToast,
  useColorMode,
} from '@chakra-ui/react';

import { useQuery, useQueryClient } from 'react-query';

import { AiFillStar } from 'react-icons/ai';
import { getMovies } from '../../utils/queries';
import { ReviewEndpointBodyType } from '../../types/APITypes';
import { ReviewModalContext } from '../../utils/ModalContext';
import { User } from 'next-auth';

export const ReviewModal: React.FC<{ user: User; inNav?: boolean }> = ({
  user,
  inNav = false,
}): React.ReactElement => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose, movie, setMovie } = useContext(
    ReviewModalContext
  );
  const [isEditingReview, setIsEditingReview] = useState(false);

  const [isOpenedFromMovie, setIsOpenedFromMovie] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(``);
  const [commentError, setCommentError] = useState(``);
  const [movieError, setMovieError] = useState(``);
  const [success, setSuccess] = useState(``);

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`movies`).catch(console.error);
      queryClient.invalidateQueries('movie').catch(console.error);
      toast({
        variant: `subtle`,
        title: success === `addition` ? `Review Added` : `Review Modified`,
        description:
          success === `addition`
            ? `Your review was successfully added to ${movie?.name}`
            : `Your review on ${movie?.name} was successfully modified`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess('');
    }
  }, [movie, queryClient, success, toast]);
  const { data: movies } = useQuery(`movies`, getMovies);

  useEffect(() => {
    if (!isOpen) {
      setIsEditingReview(false);
      setRating(0);
      setComment(``);
      return;
    }
    if (movie) {
      const rvw = movie?.reviews.find((review) => {
        return review?.user?._id === user.sub;
      });
      if (rvw) {
        setIsEditingReview(true);
        setRating(rvw.rating);
        return setComment(rvw?.comment || '');
      }
    }
    setIsEditingReview(false);
    setRating(0);
    setComment(``);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return setIsOpenedFromMovie(false);
    }
    if (movie) {
      setIsOpenedFromMovie(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    onClose: () => void
  ) => {
    e.preventDefault();
    if (!movie) {
      return setMovieError(`Please select a valid movie.`);
    }
    const data: ReviewEndpointBodyType = {
      // eslint-disable-next-line no-underscore-dangle
      movieID: movie._id,
      comment,
      rating,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URI}/api/review`, {
      method: `post`,
      body: JSON.stringify(data),
    });

    const successData = await res.json();

    if (res.status === 200) {
      setSuccess(successData.type);
      setComment(``);
      setMovie(null);
      return onClose();
    }
    if (res.status === 401) return setCommentError('You are not authorized');
    return setCommentError(`There was an error...`);
  };

  const handleRatingChange = (x: number): void => {
    return setRating(x);
  };

  const handleNumInputRatingChange = (x: string, y: number): void => {
    return setRating(y);
  };

  return (
    <>
      <Button
        variant="ghost"
        width={inNav ? '' : 'full'}
        colorScheme="purple"
        mr={user?.isAdmin ? 0 : 3}
        leftIcon={<AddIcon />}
        onClick={() => {
          setMovie(null);
          onOpen();
        }}
      >
        Add review
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} id={'review-modal'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading
              fontSize="2xl"
              fontWeight="semibold"
              maxWidth="85%"
              mr="auto"
            >
              {isEditingReview && movie
                ? `Editing review for ${movie?.name}`
                : isOpenedFromMovie && movie
                ? `Add a review to ${movie?.name}`
                : 'Add a review'}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {!isOpenedFromMovie && (
                <>
                  <FormLabel mb={3} fontSize="1.1em" fontWeight="semibold">
                    Select Movie
                  </FormLabel>

                  <Select
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    placeholder={movie?.name || 'No Movie Selected'}
                    onChange={(e) => {
                      e.preventDefault();
                      const movieFound = movies?.find(
                        (mv) => mv?.name === e.target.value
                      );
                      if (!movieFound) {
                        return setMovieError(`Please select a valid movie!`);
                      }
                      setMovieError(``);
                      return setMovie(movieFound);
                    }}
                  >
                    {movies &&
                      movies?.map((_) =>
                        movie?.name !== _.name ? (
                          <option key={_.name}>{_.name}</option>
                        ) : (
                          ''
                        )
                      )}
                  </Select>
                </>
              )}
              {movieError && (
                <Text color={colorMode === 'light' ? `red.600` : `red.300`}>
                  {movieError}
                </Text>
              )}
              <FormLabel my={3}>
                <Flex justifyContent="space-between">
                  <Text fontSize="1.1em" fontWeight="semibold">
                    Rating
                  </Text>
                  <Text color={useColorModeValue(`gray.600`, `gray.400`)}>
                    {rating}/10
                  </Text>
                </Flex>
              </FormLabel>
              <Box>
                <Flex>
                  <NumberInput
                    max={10}
                    min={0}
                    inputMode="decimal"
                    step={0.1}
                    maxW="100px"
                    mr="2rem"
                    value={rating}
                    onChange={handleNumInputRatingChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    flex="1"
                    focusThumbOnChange={false}
                    value={rating}
                    onChange={handleRatingChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack
                        bg={useColorModeValue(`purple.500`, `purple.300`)}
                      />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize={6}>
                      <Box
                        color={useColorModeValue(`purple.500`, `purple.300`)}
                        as={AiFillStar}
                      />
                    </SliderThumb>
                  </Slider>
                </Flex>
              </Box>

              <Text my={3}>Enter a comment!</Text>
              <Textarea
                value={comment}
                onChange={(e) => {
                  e.preventDefault();

                  if (
                    (e.target.value?.length > 300 ||
                      e.target.value?.length < 10) &&
                    e.target.value.length !== 0
                  ) {
                    setCommentError(
                      `Comment needs to be more than 10 characters and less than 300`
                    );
                  } else {
                    setCommentError(``);
                  }
                  return setComment(e.target.value);
                }}
                placeholder="This movie was great because it was..."
                resize="vertical"
              />
              {commentError && (
                <Text color={colorMode === 'light' ? `red.600` : `red.300`}>
                  {commentError}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue(`gray.100`, `gray.800`)}
            borderBottomRadius="md"
          >
            <Button
              colorScheme="purple"
              mr={3}
              onClick={(e) => handleSubmit(e, onClose)}
              isDisabled={!!(commentError || movieError)}
            >
              {isEditingReview && movie ? 'Edit Review' : 'Add Review'}
            </Button>
            <Button
              onClick={() => {
                onClose();
                setMovie(null);
                setIsOpenedFromMovie(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
