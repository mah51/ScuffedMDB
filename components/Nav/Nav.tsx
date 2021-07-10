import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useColorMode,
  Stack,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import Link from 'next/link';
import MovieModal from '../MovieModal';
import { UserAuthType } from '../../types/next-auth';
import ReviewModal from '../ReviewModal';
import { signout } from 'next-auth/client';

const links = [
  { link: `/`, name: `Home` },
  { link: `/user/me`, name: `My Reviews` },
  { link: `/users`, name: `All Users`, adminOnly: true },
];

interface NavProps {
  user: UserAuthType;
  showMovies: boolean;
  showReview: boolean;
}

export const Nav: React.FC<NavProps> = ({
  user,
  showMovies,
  showReview,
}): React.ReactElement => {
  const { colorMode, toggleColorMode } = useColorMode();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const shortSiteName = process.env.NEXT_PUBLIC_SHORT_SITE_NAME;
  return (
    <>
      <Box
        width="100vw"
        borderTop={'5px solid'}
        borderColor={useColorModeValue('purple.500', 'purple.300')}
      >
        <Flex
          h={20}
          maxWidth="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={8} alignItems="center" ml={5}>
            <Link href="/">
              <a>
                <Heading fontSize="2xl">
                  {useBreakpointValue({
                    base: shortSiteName || 'SMDB',
                    md: siteName || 'ScuffedMDB',
                  })}
                </Heading>
              </a>
            </Link>
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

            <Stack isInline>
              {user.isReviewer && showReview && (
                <ReviewModal isAdmin={user.isAdmin} inNav />
              )}
              {user.isAdmin && showMovies && <MovieModal />}
            </Stack>

            <Menu>
              <MenuButton
                mr={5}
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
              >
                <Avatar size="sm" boxShadow="none" src={user.image} />
              </MenuButton>
              <MenuList zIndex={999}>
                {links.map((link, i) => {
                  if (link.adminOnly && !user.isAdmin) {
                    return null;
                  }
                  return (
                    <Link href={link.link} key={i.toString()} passHref>
                      <MenuItem>{link.name}</MenuItem>
                    </Link>
                  );
                })}
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    signout();
                  }}
                >
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
