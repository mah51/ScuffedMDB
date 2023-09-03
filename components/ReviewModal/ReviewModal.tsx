import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';

import { useQuery, useQueryClient } from 'react-query';

import { User } from 'next-auth';
import { AiFillStar } from 'react-icons/ai';
import { ReviewEndpointBodyType } from '../../types/APITypes';
import { ReviewModalContext } from '../../utils/ModalContext';
import { getMovies, getRestaurants } from '../../utils/queries';

export const ReviewModal: React.FC<{
  user: User;
  inNav?: boolean;
  inMobileNav?: boolean;
}> = ({ user, inNav = false, inMobileNav = false }): React.ReactElement => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose, movie, setMovie, restaurant, setRestaurant } = useContext(
    ReviewModalContext
  );

  const { data: movies } = useQuery(`movies`, getMovies);
  const { data: restaurants } = useQuery(`restaurants`, getRestaurants);


  const [isEditingReview, setIsEditingReview] = useState(false);

  const [isOpenedFromMovie, setIsOpenedFromMovie] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(``);
  const [commentError, setCommentError] = useState(``);
  const [selectionError, setselectionError] = useState(``);
  const [success, setSuccess] = useState(``);
  const [option, setOption] = useState('');

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (success) {
      queryClient
        .invalidateQueries(`movie-${movie?.name}`)
        .catch(console.error);
      queryClient.invalidateQueries(`movies`).catch(console.error);
      queryClient.invalidateQueries(`restaurants`).catch(console.error);
      toast({
        variant: `subtle`,
        title: success === `addition` ? `Review Added` : `Review Modified`,
        description:
          success === `addition`
            ? `Your review was successfully added to ${movie ? movie?.name : restaurant?.name}`
            : `Your review on ${movie ? movie?.name : restaurant?.name} was successfully modified`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess('');
    }
  }, [movie, queryClient, success, toast]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditingReview(false);
      setRating(0);
      setComment(``);
      setOption('');
      setIsOpenedFromMovie(false);
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
    if (restaurant) {
      const rvw = restaurant?.reviews.find((review) => {
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
  }, [movie, isOpen, restaurant]);

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
    if (!movie && !restaurant) {
      if (!movie){
        return setselectionError(`Please select a valid movie.`); 
      }
      if (!restaurant){
        return setselectionError('Please select a valid restaurant')
      }
    }
    const data: ReviewEndpointBodyType = {
      // eslint-disable-next-line no-underscore-dangle
      movieID: movie?._id,
      restaurantID: restaurant?._id,
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
      setRestaurant(null);
      return onClose();
    }
    if (res.status === 401) return setCommentError('You are not authorized');
    return setCommentError(successData?.message || `There was an error...`);
  };

  const handleRatingChange = (x: number): void => {
    return setRating(x);
  };

  const handleNumInputRatingChange = (x: string, y: number): void => {
    return setRating(y);
  };

  return (
    <>
      {inMobileNav ? (
        <Button
          mt={2}
          leftIcon={<AddIcon />}
          w="95%"
          mx={'auto'}
          variant="ghost"
          onClick={() => {
            setMovie(null);
            onOpen();
          }}
        >
          Add review
        </Button>
      ) : (
        <Button
          variant="ghost"
          width={inNav ? '' : 'full'}
          colorScheme={process.env.COLOR_THEME}
          mr={user?.isAdmin ? 0 : 3}
          leftIcon={<AddIcon />}
          onClick={() => {
            setMovie(null);
            onOpen();
          }}
        >
          {' '}
          Add review
        </Button>
      )}

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
                    Select Option
                  </FormLabel>
                  <Select mb={3} placeholder='Select option'
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.value === 'restaurant' && movie) {
                        setMovie(null);
                      }
                      return setOption(e.target.value);
                    }}
                  >
                    <option value='movie'>Movie</option>
                    <option value='restaurant'>Restaurant</option>
                  </Select>
                  {
                    option === 'movie' &&
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
                            return setselectionError(`Please select a valid movie!`);
                          }
                          setselectionError(``);
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
                  }
                  {
                    option === 'restaurant' &&
                    <>
                      <FormLabel mb={3} fontSize="1.1em" fontWeight="semibold">
                        Select Restaurant
                      </FormLabel>
                      <Select
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        placeholder={restaurant?.name || 'No Restaurant Selected'}
                        onChange={(e) => {
                          e.preventDefault();
                          const found = restaurants?.data?.find((res : any) => {
                            return res?.name === e.target.value;
                          });
                          if (!found){
                            return setselectionError('Please a select a valid restaurant!');
                          }
                          setselectionError('');
                          setRestaurant(found);
                          return;
                        }}
                      >
                        {restaurants &&
                          restaurants?.data?.map((_) =>
                            restaurant?.name !== _.name ? (
                              <option key={_.name}>{_.name}</option>
                            ) : (
                              ''
                            )
                          )}
                      </Select>
                    </>
                  }
                </>
              )}
              {selectionError && (
                <Text color={colorMode === 'light' ? `red.600` : `red.300`}>
                  {selectionError}
                </Text>
              )}
              {
                (option || isOpenedFromMovie) &&
                <>
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
                            bg={useColorModeValue(
                              `${process.env.COLOR_THEME}.500`,
                              `${process.env.COLOR_THEME}.300`
                            )}
                          />
                        </SliderTrack>
                        <SliderThumb fontSize="sm" boxSize={6}>
                          <Box
                            color={useColorModeValue(
                              `${process.env.COLOR_THEME}.500`,
                              `${process.env.COLOR_THEME}.300`
                            )}
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
                </>
              }
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
              colorScheme={process.env.COLOR_THEME}
              mr={3}
              onClick={(e) => handleSubmit(e, onClose)}
              isDisabled={!!(commentError || selectionError) || (!movie && !restaurant)}
            >
              {isEditingReview && movie ? 'Edit Review' : 'Add Review'}
            </Button>
            <Button
              onClick={() => {
                onClose();
                setMovie(null);
                setIsOpenedFromMovie(false);
                setRestaurant(null);
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
