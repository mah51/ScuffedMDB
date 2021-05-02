import {
  Box,
  chakra,
  useColorModeValue,
  Text,
  Stack,
  Button,
  Icon,
  Image,
  Container,
  Flex,
} from '@chakra-ui/react';

export const LandingPage = () => (
  <Flex minH="100vh" flex={1} direction="row" align="center" justify="center">
    <Box
      w={{ base: `full`, md: 11 / 12, xl: 8 / 12 }}
      mx="auto"
      textAlign={{ base: `left`, md: `center` }}
    >
      <chakra.h1
        mb={6}
        fontSize={{ base: `4xl`, md: `6xl` }}
        fontWeight="bold"
        lineHeight="none"
        letterSpacing={{ base: `normal`, md: `tight` }}
        color={useColorModeValue(`gray.900`, `gray.100`)}
      >
        <Text
          display={{ base: `block`, lg: `inline` }}
          w="full"
          bgClip="text"
          bgGradient="linear(to-r, green.400,purple.500)"
          fontWeight="extrabold"
        >
          ScuffedMDB
        </Text>
        {` `}
      </chakra.h1>
      <chakra.p
        px={{ base: 0, lg: 24 }}
        mb={6}
        fontSize={{ base: `lg`, md: `xl` }}
        color={useColorModeValue(`gray.600`, `gray.300`)}
      >
        The website where cool kids write movie reviews :).
      </chakra.p>
      <Button
        as="a"
        variant="solid"
        color={useColorModeValue(`purple.700`, `purple.300`)}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w={{ base: `full`, sm: `auto` }}
        mb={{ base: 2, sm: 0 }}
        href="/api/oauth"
        size="lg"
      >
        Log in with discord
        <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </Icon>
      </Button>
    </Box>
  </Flex>
);
