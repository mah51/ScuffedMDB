import Image from "next/image";
import {
  Box,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  AvatarGroup,
} from "@chakra-ui/react";
import moment from 'moment';

interface CardProps {
  image: string;
  name: string;
  rating: number;
  numRatings: number;
  dateAdded: Date;
  reviews: any;
}

export const Card = ({ image, name, reviews, rating, numRatings, dateAdded }: CardProps) => {
  return (
    <Box
      maxW={"400px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"md"}
      p={6}
      overflow={"hidden"}
    >
      <Box h={"210px"} bg={"gray.100"} mt={-6} mx={-6} mb={6} pos={"relative"}>
        <Image src={image} layout={"fill"} />
      </Box>
      <Stack>
        <Heading
          color={useColorModeValue("gray.700", "white")}
          fontSize={"2xl"}
          fontFamily={"body"}
        >
          {name}
        </Heading>
        <Text color={"gray.500"}>Some IMDB api description....</Text>
      </Stack>
      <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
      <AvatarGroup size="md" max={5}>
         {
           reviews.map(review => (
              <Avatar name={review.username} src={`https://cdn.discordapp.com/avatars/${review.id}/${review.avatar}`} />
           ))
        
         }
        </AvatarGroup>
        <Stack direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>{rating} · {numRatings} reviews</Text>
          <Text color={"gray.500"}>{moment(dateAdded).format('DD/MM/YY')}</Text>
        </Stack>
      </Stack>
    </Box>
  );
};
