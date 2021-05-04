import { Container, SimpleGrid, useDisclosure, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import MovieDetailsModal from './MovieDetailsModal';

export const CardGrid = ({ movies, user }) => {
  const [modalMovie, setModalMovie] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <MovieDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        movie={modalMovie}
        user={user}
      />
      <Container maxW="container.xl" mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {movies?.data?.map((movie, i) => (
            <Box
              onClick={() => {
                setModalMovie(movie);
                return onOpen();
              }}
            >
              <Card {...movie} key={`${i.toString()}card`} />
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
