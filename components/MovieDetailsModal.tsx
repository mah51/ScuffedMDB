import React, { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Heading,
  useColorModeValue,
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Avatar,
  SimpleGrid,
  HStack,
  Box,
  Flex,
  ModalFooter,
  Button,
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverContent,
  PopoverCloseButton,
  ButtonGroup,
  PopoverBody,
  PopoverArrow,
  PopoverFooter,
  useToast,
} from '@chakra-ui/react';

import { format } from 'date-fns';
import { useQueryClient } from 'react-query';

function MovieDetailsModal({ isOpen, onClose, movie, user }) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const open = () => setIsPopoverOpen(!isPopoverOpen);
  const close = () => setIsPopoverOpen(false);
  const initialRef = React.useRef();
  if (!movie?.name) {
    onClose();
  }
  const toast = useToast();
  const queryClient = useQueryClient();
  const handleMovieDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      close();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`,
        {
          method: `delete`,
          // eslint-disable-next-line no-underscore-dangle
          body: JSON.stringify({ id: movie?._id }),
        },
      );
      const data = await response.json();

      setLoading(false);

      onClose();
      if (response.status !== 200) {
        return toast({
          variant: `subtle`,
          title: `There was an error`,
          description: data.message,
          status: `error`,
          duration: 5000,
          isClosable: true,
        });
      }
      await queryClient.invalidateQueries(`movies`);
      console.log(data);
      toast({
        variant: `subtle`,
        title: `Movie Deleted`,
        description: `${data.name} was deleted successfully :)`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setLoading(false);
      toast({
        variant: `subtle`,
        title: `There was an error`,
        description: err.message,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            borderBottom="1px solid"
            borderColor={useColorModeValue(`gray.300`, `gray.600`)}
          >
            <Heading>{movie?.name}</Heading>
            <Text>{movie?.tagLine}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody my={3}>
            <Accordion allowToggle>
              <AccordionItem border="none">
                <h2>
                  <AccordionButton>
                    <Box
                      flex="1"
                      textAlign="left"
                      fontWeight="semibold"
                      fontSize="2xl"
                    >
                      Description
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>{movie?.description}</AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <h2>
                  <AccordionButton>
                    <Box
                      flex="1"
                      textAlign="left"
                      fontWeight="semibold"
                      fontSize="2xl"
                    >
                      Reviews
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel maxHeight="400px" overflowY="scroll" my={5}>
                  {movie?.reviews?.length > 0 ? (
                    <SimpleGrid columns={1} spacingY={5}>
                      {movie?.reviews?.map((review, i) => (
                        <Flex width="100%" key={`${i.toString}review`}>
                          <Avatar
                            size="lg"
                            src={`https://cdn.discordapp.com/avatars/${review.user.id}/${review.user.avatar}`}
                          />
                          <Flex
                            ml={3}
                            direction="column"
                            width="full"
                            isTruncated
                          >
                            <HStack
                              justifyContent="space-between"
                              width="full"
                              isTruncated
                            >
                              <Text
                                fontSize="lg"
                                fontWeight="semibold"
                                alignSelf="flex-start"
                              >
                                {review.user.username}#
                                {review.user.discriminator}
                              </Text>
                              <Text fontSize="lg" fontWeight="semibold">
                                {review.rating} / 10
                              </Text>
                            </HStack>

                            <Text textAlign="left" isTruncated>
                              {review.comment}
                            </Text>
                          </Flex>
                        </Flex>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Flex width="full" justifyContent="center">
                      <Text fontSize="xl">No Reviews Yet...</Text>
                    </Flex>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          {user.isAdmin && movie?.createdAt && (
            <ModalFooter
              bg={useColorModeValue(`gray.50`, `gray.800`)}
              roundedBottom="md"
            >
              <Flex mr="auto">
                <Text fontWeight="semibold">
                  Created •{` `}
                  {format(new Date(movie.createdAt), `dd/MM/yy HH:mm:ss`)}
                </Text>
              </Flex>
              <Popover
                isOpen={isPopoverOpen}
                onClose={close}
                onOpen={open}
                placement="right"
              >
                <PopoverTrigger>
                  <Button colorScheme="red" isLoading={loading}>
                    Delete Movie
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <PopoverHeader fontWeight="semibold">
                    Confirmation
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    Are you sure you want to delete {movie.name}?
                  </PopoverBody>
                  <PopoverFooter d="flex" justifyContent="flex-end">
                    <ButtonGroup size="sm">
                      <Button variant="outline" onClick={close}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={handleMovieDelete}>
                        Confirm
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MovieDetailsModal;
