import { Container, SimpleGrid } from '@chakra-ui/react';
import { Card } from './Card';

export const CardGrid = ({ movies }) => (
  <Container maxW="container.xl">
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
      {movies?.data?.map((movie, i) => (
        <Card {...movie} key={`${i.toString()}card`} />
      ))}
    </SimpleGrid>
  </Container>
);
