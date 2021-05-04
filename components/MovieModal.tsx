import React, { useEffect, useState } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';

import { AddIcon, SearchIcon } from '@chakra-ui/icons';

import { useQueryClient } from 'react-query';
import { SearchResults } from './SearchResults';

function MovieModal() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(``);
  const [success, setSuccess] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();
  const queryClient = useQueryClient();
  const toast = useToast();
  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`movies`).catch(() => {});
      toast({
        title: success.type === `addition` ? `Movie Added` : `Movie Deleted`,
        description:
          success.type === `addition`
            ? `${success.data?.name} was successfully added`
            : `${success.data.name} was successfully deleted`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setSuccess(null);
    } else if (error) {
      toast({
        title: `There was an error`,
        description: error,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess(null);
      setError(null);
    }
  }, [success, error]);

  const handleChange = async (e) => {
    if (e.target.value.length === 0) return setResults([]);
    if (error) setError(``);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie-api?search=${e.target.value}`,
      );
      const data = await response.json();
      if (response.status !== 200) {
        setError(data.status_message);
      }
      setLoading(false);
      setResults(data.results.splice(0, 5));
    } catch (err) {
      if (err) {
        setError(err);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        colorScheme="gray"
        display={{ base: `none`, md: `block` }}
        mr={3}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Add movie
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a movie</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Find movie</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  onChange={handleChange}
                  ref={initialRef}
                  type="text"
                  placeholder="Search OMDB..."
                />
              </InputGroup>
            </FormControl>

            {results ? (
              <SearchResults
                data={results}
                loading={loading}
                error={error}
                setSuccess={setSuccess}
                setError={setError}
              />
            ) : (
              ``
            )}
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue(`gray.50`, `gray.800`)}
            roundedBottom="md"
          >
            <Button colorScheme="purple" mr={3}>
              Add movie
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MovieModal;
