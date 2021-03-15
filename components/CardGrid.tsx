import { Box, Container, SimpleGrid } from "@chakra-ui/layout";
import { data } from "../data";
import { Card } from "./Card";

export const CardGrid = () => {
  return (
    <Container maxW={"container.xl"}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {data.map((movie) => {
          console.log("looping");
          return (
            <Card
              rating={movie.rating}
              numRatings={movie.numRatings}
              dateAdded={movie.dateAdded}
              image={movie.image}
              name={movie.name}
              reviews={movie.reviews}
            />
          );
        })}
      </SimpleGrid>
    </Container>
  );
};
