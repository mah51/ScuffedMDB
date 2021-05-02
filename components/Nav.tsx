import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Stack,
} from '@chakra-ui/react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import MovieModal from './MovieModal';

const Links = [`Home`, `My Reviews`];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: `none`,
      bg: useColorModeValue(`gray.200`, `gray.700`),
    }}
    href="#"
  >
    {children}
  </Link>
);

export const Nav = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: !isOpen ? `none` : `inherit` }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box>
              <strong>ScuffedMDB</strong>
            </Box>
            <HStack as="nav" spacing={4} display={{ base: `none`, md: `flex` }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>

          <Stack align="center" direction="row" spacing={3}>
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Toggle Color Mode"
              onClick={toggleColorMode}
              icon={
                colorMode == `light` ? (
                  <IoMoon size={18} />
                ) : (
                  <IoSunny size={18} />
                )
              }
            />
            {(user.isReviewer || user.isAdmin) && (
              <Button
                variant="solid"
                colorScheme="purple"
                size="sm"
                mr={user.isAdmin ? 0 : 3}
                leftIcon={<AddIcon />}
              >
                Add review
              </Button>
            )}

            {user.isAdmin && <MovieModal />}
            <Menu>
              <MenuButton
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
                <MenuItem>Do something else..</MenuItem>
                <MenuDivider />
                <MenuItem as="a" href="/api/signout">
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as="nav" spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
