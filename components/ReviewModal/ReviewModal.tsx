import React, { useState, useEffect } from 'react';
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
  useDisclosure,
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
} from '@chakra-ui/react';

import { useQuery, useQueryClient } from 'react-query';

import { AiFillStar } from 'react-icons/ai';
import { getMovies } from '../../utils/queries';
import { MovieType } from '../../models/movie';
import { ReviewEndpointBodyType } from '../../types/APITypes';

export const ReviewModal = ({ isAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'review-modal' });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(``);
  const [commentError, setCommentError] = useState(``);
  const [movie, setMovie] = useState(null);
  const [movieError, setMovieError] = useState(``);
  const [success, setSuccess] = useState(``);

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`movies`).catch(console.error);
      toast({
        variant: `subtle`,
        title: success === `addition` ? `Review Added` : `Review Modified`,
        description:
          success === `addition`
            ? `Your review was successfully added to ${movie?.name}`
            : `Your review on ${movie.name} was successfully modified`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess(null);
    }
  }, [success]);

  const initialRef = React.useRef();
  const { data: movies } = useQuery(`movies`, getMovies);

  const handleSubmit = async (e) => {
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
    return setCommentError(`There was an error...`);
  };

  const handleRatingChange = (x) => {
    setRating(x);
  };

  return (
    <>
      <Button
        variant="solid"
        colorScheme="purple"
        mr={isAdmin ? 0 : 3}
        leftIcon={<AddIcon />}
        onClick={() => onOpen()}
      >
        Add review
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} id={'review-modal'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading fontSize="2xl" fontWeight="semibold">
              Add a review
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel mb={3} fontSize="1.1em" fontWeight="semibold">
                Select Movie
              </FormLabel>
              <Select
                placeholder="No Movie Selected"
                onChange={(e) => {
                  e.preventDefault();
                  const movieFound = movies.filter(
                    (mv) => mv.name === e.target.value
                  )[0];
                  if (!movieFound) {
                    return setMovieError(`Please select a valid movie!`);
                  }
                  setMovieError(``);
                  return setMovie(movieFound);
                }}
              >
                {movies &&
                  movies?.map((_: MovieType) => (
                    <option key={_.name}>{_.name}</option>
                  ))}
              </Select>
              {movieError && (
                <Text color={useColorModeValue(`red.600`, `red.300`)}>
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
                    onChange={handleRatingChange}
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
                <Text color={useColorModeValue(`red.600`, `red.300`)}>
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
              onClick={handleSubmit}
              isDisabled={!!(commentError || movieError)}
            >
              Add Review
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
