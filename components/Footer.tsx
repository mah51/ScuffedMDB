import { Box, ButtonGroup, Flex, IconButton, Text } from "@chakra-ui/react";
import * as React from "react";
import { FaDiscord, FaGithub, FaInstagram } from "react-icons/fa";

export const Footer = () => {
  return (
    <Box as="footer" role="contentinfo" py="6">
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
        align="center"
      >
        <a
          aria-current="page"
          aria-label="Back to Home page"
          href="/"
          rel="home"
        >
          <h1>ScuffedMDB</h1>
        </a>

        <Text marginStart={{ md: "auto" }} justifySelf={"middle"}>
          Made by Mikerophone 🤠
        </Text>

        <ButtonGroup
          marginStart={{ md: "auto" }}
          color="gray.600"
          variant="ghost"
        >
          <IconButton
            as="a"
            href="https://www.instagram.com/michael.__.hall/"
            aria-label="Instagram"
            icon={<FaInstagram />}
          />
          <IconButton
            as="a"
            href="https://www.github.com/mah51"
            aria-label="GitHub"
            icon={<FaGithub />}
          />
          <IconButton
            as="a"
            href="https://discord.gg/UmXUUaA"
            aria-label="Discord"
            icon={<FaDiscord />}
          />
        </ButtonGroup>
      </Flex>
    </Box>
  );
};
