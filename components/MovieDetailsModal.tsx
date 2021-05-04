import React from 'react';

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
} from '@chakra-ui/react';

function MovieDetailsModal({ isOpen, onClose, movie }) {
  const initialRef = React.useRef();
  if (!movie?.name) {
    onClose();
  }

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
        </ModalContent>
      </Modal>
    </>
  );
}

export default MovieDetailsModal;
