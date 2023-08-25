import {
  Box,
  chakra,
  Stack,
  Tooltip,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

const SocialIcons = ({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) => {
  return (
    <Tooltip label={label} placement="top">
      <chakra.button
        bg={useColorModeValue(`blackAlpha.100`, `whiteAlpha.100`)}
        rounded="full"
        w={8}
        h={8}
        cursor="pointer"
        as="a"
        href={href}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        transition="background 0.3s ease"
        _hover={{
          bg: useColorModeValue(`blackAlpha.200`, `whiteAlpha.200`),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    </Tooltip>
  );
};
export const Footer: React.FC = (): React.ReactElement => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';

  return (
    <>
      <Box as="footer" role="contentinfo" mt={'auto'} py="6">
        <Stack
          direction={{ base: `column`, md: `row` }}
          maxW={{ base: `xl`, md: `7xl` }}
          mx="auto"
          px={{ base: `6`, md: `0` }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/" passHref>
            <chakra.a
              ml={{ base: `0`, md: 5 }}
              aria-current="page"
              aria-label="Back to Home page"
              rel="home"
            >
              <h1>{siteName}</h1>
            </chakra.a>
          </Link>

          <Stack
            direction="row"
            spacing={6}
            ml="auto"
            mr={{ base: `auto`, md: 5 }}
          >
            <SocialIcons label="GitHub" href="https://github.com/mah51/">
              <FaGithub />
            </SocialIcons>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
