import React, { useState } from 'react';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/hooks';
import {
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
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';

import { SearchResults } from './SearchResults';

function MovieModal() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(``);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();

  const handleChange = async (e) => {
    if (e.target.value.length === 0) return setResults([]);
    if (error) setError(``);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}&language=en-US&query=${e.target.value}&page=1&include_adult=false`,
      );
      const { status, data } = response;
      if (status !== 200) {
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
        size="sm"
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
              <SearchResults data={results} loading={loading} error={error} />
            ) : (
              ``
            )}
          </ModalBody>

          <ModalFooter>
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
