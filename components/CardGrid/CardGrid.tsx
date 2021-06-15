import {
  Container,
  SimpleGrid,
  useDisclosure,
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  chakra,
  useColorModeValue,
  useToast,
  useColorMode,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { useState } from 'react';
import { useEffect } from 'react';
import Card from '../Card';
import MovieDetailsModal from '../MovieDetailsModal';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import { NextSeo } from 'next-seo';

interface CardGridProps {
  movies: { data: MovieType[] };
  user: UserType;
  movieID?: string | string[];
}

export const CardGrid: React.FC<CardGridProps> = ({
  movies: unSortedMovies,
  user,
  movieID,
}): React.ReactElement => {
  const [modalMovie, setModalMovie] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');

  const toast = useToast();
  const { colorMode } = useColorMode();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`otherToast`, {
      variant: `subtle`,
      title: 'Movie not found',
      description: 'The shared movie does not exist',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [colorMode, toast]);

  const movies = {
    data: unSortedMovies.data
      ?.filter((mv) => {
        if (mv.name.toLowerCase().includes(filter)) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        if (sort === 'recent' || sort === 'old') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sort === 'best') {
          return a.rating - b.rating;
        } else if (sort === 'worst') {
          return a.rating - b.rating;
        }
      }),
  };

  useEffect(() => {
    if (movieID && !isOpen) {
      const foundMovie = movies.data.find((mv) => mv._id === movieID);
      if (!foundMovie) {
        toast({
          id: 'otherToast',
          variant: `subtle`,
          title: 'Movie not found',
          description: 'The shared movie does not exist',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setModalMovie(foundMovie);
      onOpen();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sort === 'best' || sort === 'recent') {
    movies.data = movies.data.reverse();
  }

  return (
    <>
      <NextSeo
        openGraph={{
          title: `ScuffedMDB`,
          type: `website`,
          site_name: `ScuffedMDB`,
          images: [
            {
              width: 2542,
              height: 1312,
              url: modalMovie
                ? modalMovie.image
                : `https://www.movie.michael-hall.me/sitePicture.png`,
              alt: modalMovie
                ? `${modalMovie.name} poster`
                : 'ScuffedMDB webpage',
            },
          ],
        }}
        description={
          modalMovie
            ? 'A user has shared this movie with you.'
            : 'A private movie rating website'
        }
      />
      <MovieDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        movie={modalMovie}
        user={user}
      />
      <Container maxW="container.xl" mt={10}>
        <Heading fontSize="6xl" textAlign="center">
          We have watched{' '}
          {
            <chakra.span color={useColorModeValue('purple.500', 'purple.300')}>
              {unSortedMovies?.data?.length}
            </chakra.span>
          }{' '}
          movies
        </Heading>
        <Flex
          width="full"
          direction={{ base: 'column', md: 'row' }}
          my={7}
          justifyContent="space-between"
        >
          <InputGroup
            maxWidth={{ base: 'full', md: '200px' }}
            mb={{ base: 5, md: 0 }}
          >
            <InputLeftElement pointerEvents="none">
              <AiOutlineSearch color="gray.300" />
            </InputLeftElement>
            <Input
              variant="filled"
              type="text"
              placeholder="Search"
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
            />
          </InputGroup>

          <Menu>
            <MenuButton as={Button} rightIcon={<BiChevronDown />}>
              Sort by...
            </MenuButton>
            <MenuList zIndex={998}>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'recent'}
                onClick={() => setSort('recent')}
              >
                Recent
              </MenuItem>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'old'}
                onClick={() => setSort('old')}
              >
                Old
              </MenuItem>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'best'}
                onClick={() => setSort('best')}
              >
                Best
              </MenuItem>
              <MenuItem
                zIndex={999}
                isDisabled={sort === 'worst'}
                onClick={() => setSort('worst')}
              >
                Worst
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          alignItems="stretch"
        >
          {movies?.data?.map((movie: MovieType<ReviewType[]>, i) => (
            <Box
              key={`${i.toString()}cardBox`}
              height="full"
              onClick={() => {
                setModalMovie(movie);
                return onOpen();
              }}
            >
              <Card movie={movie} key={`${i.toString()}card`} />
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
