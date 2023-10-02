import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import React, { FormEvent, useEffect, useState } from 'react';

import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { addMovie } from '@components/SearchResults/SearchResults';
import { useQueryClient } from '@tanstack/react-query';
import { OMDBMovie, OMDBResponse } from '../../pages/api/movie-api';
import RestaurantModal from '../RestaurantModal';
import SearchResults from '../SearchResults';
import BookModal from '@components/BookModal';

export const MovieModal: React.FC<{ inMobileNav?: boolean }> = ({
  inMobileNav = false,
}): React.ReactElement => {
  const [results, setResults] = useState<OMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(``);
  const [success, setSuccess] = useState<{ type: string; data: any } | null>(
    null
  );

  const [searchByID, setSearchByID] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isRestaurantOpen, onOpen: onRestaurantOpen, onClose: onRestaurantClose } = useDisclosure();
  const { isOpen: isBookOpen, onOpen: onBookOpen, onClose: onBookClose} = useDisclosure();

  const initialRef = React.useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries({ queryKey: [`movies`] });
      queryClient.invalidateQueries({ queryKey: [`restaurants`] });
      toast({
        variant: `subtle`,
        title: success.type === `addition` ? `${success.data?.alias ? 'Restaurant' : 'Movie'} Added` : `${success.data?.alias ? 'Restaurant' : 'Movie'} Deleted`,
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
        variant: `subtle`,
        title: `There was an error`,
        description: error,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess(null);
      setError('');
    }
  }, [success, error, onClose, queryClient, toast]);

  interface FormFields {
    0: HTMLInputElement;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & FormFields;

    if (error) setError(``);
    if (searchByID) {
      const resID = await addMovie(target['0'].value);
      if (resID.success) {
        onClose();
        toast({
          variant: `subtle`,
          title: `Movie Added`,
          description: `${(resID?.data as any)?.data?.name
            } was successfully added`,
          status: `success`,
          duration: 5000,
          isClosable: true,
        });
        await queryClient.invalidateQueries({ queryKey: [`movies`] });
        return;
      } else {
        toast({
          variant: `subtle`,
          title: `Movie could not be added`,
          description: `${resID.message}`,
          status: `error`,
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie-api?search=${target['0'].value}`
      );
      const data: OMDBResponse = await response.json();
      if (response.status !== 200) {
        console.error(data.status_message);
        return setError(data.status_message || 'An error occurred');
      }
      setLoading(false);
      if (!data?.results?.length) {
        setError(`No results found :(`);
      }
      setResults(data.results.splice(0, 5));
    } catch (err) {
      console.error(err);
      if (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      {inMobileNav ? (
        <>
          <Button
            variant="ghost"
            width="95%"
            mx="auto"
            mt={2}
            leftIcon={<AddIcon />}
            onClick={onOpen}
          >
            Add movie
          </Button>
          <Button
            variant="ghost"
            width="95%"
            mx="auto"
            mt={2}
            leftIcon={<AddIcon />}
            onClick={onRestaurantOpen}
          >
            Add Restaurant
          </Button>
        </>
      ) : (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<AddIcon />} variant='ghost'
          >
            Open menu
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onOpen}>Add Movie</MenuItem>
            <MenuItem onClick={onRestaurantOpen}>Add Restaurant</MenuItem>
            <MenuItem onClick={onBookOpen}>Add Book</MenuItem>
          </MenuList>
        </Menu>
      )}
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a movie</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel display={'flex'}>
                  <Text
                    _hover={{
                      cursor: 'pointer',
                    }}
                    onClick={() => setSearchByID(false)}
                    color={searchByID ? 'gray.500' : 'lightblue'}
                  >
                    Search for movie /
                  </Text>{' '}
                  <Text
                    _hover={{
                      cursor: 'pointer',
                    }}
                    onClick={() => setSearchByID(true)}
                    ml="2"
                    color={searchByID ? 'lightblue' : 'gray.500'}
                  >
                    Or add by ID
                  </Text>
                </FormLabel>
                <Flex>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      ref={initialRef}
                      name="movie"
                      type="text"
                      placeholder="Search OMDB..."
                    />
                  </InputGroup>
                  <Button
                    type="submit"
                    ml={5}
                    colorScheme={process.env.COLOR_THEME}
                  >
                    Search
                  </Button>
                </Flex>
              </FormControl>
            </form>

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
            <Button colorScheme={process.env.COLOR_THEME} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <RestaurantModal isRestaurantOpen={isRestaurantOpen} onRestaurantClose={onRestaurantClose} setError={setError} setSuccess={setSuccess} />
      <BookModal isBookOpen={isBookOpen} onBookClose={onBookClose} setError={setError} setSuccess={setSuccess}/>
    </>
  );
};
