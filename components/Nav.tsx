import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  Link as ChakraLink,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import MovieModal from './MovieModal';
import ReviewModal from './ReviewModal';
import { UserType } from '../models/user';

const links = [
  { link: `/`, name: `Home` },
  { link: `/reviews`, name: `My Reviews` },
  { link: `/users`, name: `All Users`, adminOnly: true },
];

interface NavProps {
  user: UserType;
  showMovies: any;
}

export const Nav = ({ user, showMovies }: NavProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box width="100vw">
        <Flex
          h={16}
          maxWidth="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={8} alignItems="center" ml={5}>
            <Heading fontSize="2xl">ScuffedMDB</Heading>
          </HStack>

          <Stack align="center" direction="row" spacing={3} mx={4}>
            <IconButton
              variant="ghost"
              aria-label="Toggle Color Mode"
              onClick={toggleColorMode}
              icon={
                colorMode === `light` ? (
                  <IoMoon size={18} />
                ) : (
                  <IoSunny size={18} />
                )
              }
            />
            {(user.isReviewer || user.isAdmin) && showMovies && (
              <ReviewModal isAdmin={user.isAdmin} />
            )}

            {user.isAdmin && showMovies && <MovieModal />}
            <Menu>
              <MenuButton
                mr={5}
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
              >
                <Avatar
                  size="sm"
                  boxShadow="none"
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`}
                />
              </MenuButton>
              <MenuList>
                {links.map((link, i) => {
                  if (link.adminOnly && !user.isAdmin) {
                    return null;
                  }
                  return (
                    <Link href={link.link}>
                      <MenuItem>{link.name}</MenuItem>
                    </Link>
                  );
                })}
                <MenuDivider />
                <MenuItem as="a" href="/api/signout">
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Box>
    </>
  );
};
