import {
  Box,
  Button,
  CloseButton,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
  Stack,
  Link as ChakraLink,
  useBreakpointValue,
  useDisclosure,
  chakra
} from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import { IoMoon, IoSunny, IoRestaurantOutline, IoHomeOutline } from 'react-icons/io5';
import { BiCameraMovie } from "react-icons/bi";
import Link from 'next/link';
import MovieModal from '../MovieModal';
import { UserAuthType } from 'next-auth';
import ReviewModal from '../ReviewModal';
import { signout } from 'next-auth/client';
import { useEffect, useState, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import { ViewContext } from 'utils/ViewContext';

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
  const links = [
    { link: `/`, name: `Home` },
    { link: `/user/${user?.sub}`, name: `My Reviews` },
    { link: `/users`, name: `All Users`, adminOnly: true },
  ];
  const { colorMode, toggleColorMode } = useColorMode();
  const bp = useBreakpointValue({ base: 'mobile', md: 'big' });
  const [isTransparent, setIsTransparent] = useState(false);
  const router = useRouter();
  const { setView } = useContext(ViewContext);
  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setIsTransparent(true);
    });
    Router.events.on('routeChangeComplete', () => {
      setTimeout(() => setIsTransparent(false), 1000);
    });
    Router.events.on('routeChangeError', () => {
      setTimeout(() => setIsTransparent(false), 1000);
    });

    return () => {
      Router.events.off('routeChangeStart', () => {
        setIsTransparent(true);
      });
      Router.events.off('routeChangeComplete', () => {
        setTimeout(() => setIsTransparent(false), 1000);
      });
      Router.events.off('routeChangeError', () => {
        setTimeout(() => setIsTransparent(false), 1000);
      });
    };
  }, []);
  return (
    <>
      <Box
        width="100vw"
        borderTop={'5px solid'}
        transition="all 0.3s ease-in-out"
        borderColor={
          isTransparent
            ? 'transparent'
            : colorMode === 'light'
              ? `${process.env.COLOR_THEME}.500`
              : `${process.env.COLOR_THEME}.300`
        }
      >
        <Flex
          h={40}
          maxWidth="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack spacing={8} alignItems="center" ml={5}>
            <Link href="/" passHref>
              <Image
                src={`/svg/logo-no-background-${process.env.COLOR_THEME}.svg`}
                width={90}
                height={90}
                alt="Logo" />
            </Link>
          </HStack>
          <HStack className="!hidden md:!flex">
            <Button onClick={() => {
              setView('movies');
              router.push('/', undefined, { shallow: true });
            }}
              colorScheme={`${process.env.COLOR_THEME}`}
              variant='ghost'
            >Movies</Button>
            <Button onClick={() => {
              setView('restaurants');
              router.push('/', undefined, { shallow: true })
            }}
              colorScheme={`${process.env.COLOR_THEME}`}
              variant='ghost'
            >Restaurants</Button>
          </HStack>
          <HStack align="center" spacing={'15px'} mx={4}>
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
            <MobileNav
              links={links}
              user={user}
              showMovies={showMovies}
              showReview={showReview}
            />

            {bp !== 'mobile' && (
              <Stack isInline spacing={'15px'} alignItems="center">
                {user.isReviewer && showReview && (
                  <ReviewModal user={user} inNav />
                )}
                {user.isAdmin && showMovies && <MovieModal />}
              </Stack>
            )}

            {bp !== 'mobile' && (
              <Menu>
                <MenuButton
                  mr={'20px!important'}
                  borderRadius="full"
                  variant="link"
                  display={{ base: 'none', md: 'inline-block' }}
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
            )}
          </HStack>
        </Flex>
      </Box>
    </>
  );
};

interface MobileNavProps {
  links: {
    link: string;
    name: string;
    adminOnly?: boolean;
  }[];
  showReview?: boolean;
  showMovies?: boolean;
  inMobileNav?: boolean;
  user: UserAuthType;
}

const MobileNav = ({ links, user }: MobileNavProps): JSX.Element | null => {
  const { view, setView } = useContext(ViewContext);
  const router = useRouter();
  const mobileNav = useDisclosure();
  const { colorMode } = useColorMode();
  const darkBg = transparentize(`${process.env.COLOR_THEME}.200`, 0.16);
  const lightBg = transparentize(`${process.env.COLOR_THEME}.600`, 0.2);
  const bp = useBreakpointValue({ base: 'mobile', md: 'big' });
  return bp === 'mobile' ? (
    <>
      {mobileNav.isOpen ? (
        <CloseButton
          onClick={mobileNav.onClose}
          zIndex={21}
          aria-label="Close menu"
        />
      ) : (
        <Avatar
          aria-label="toggle menu"
          src={user.image}
          size="sm"
          mr={4}
          display={{ md: 'none' }}
          cursor="pointer"
          onClick={mobileNav.isOpen ? mobileNav.onClose : mobileNav.onOpen}
          boxShadow="none"
        />
      )}
      <Flex
        pos="absolute"
        top={0}
        justifyContent="flex-center"
        left={0}
        direction="column"
        width="100vw"
        height="100vh"
        zIndex={20}
        ml={'0!important'}
        css={{
          backdropFilter: `saturate(180%) blur(5px)`,
          backgroundColor:
            colorMode === 'light'
              ? `rgba(255, 255, 255, 0.97)`
              : `rgba(26, 32, 44, 0.97)`,
        }}
        display={mobileNav.isOpen ? `flex` : `none`}
        pt={16}
      >
        {links.map((link, index) => {
          if (link.adminOnly && !user.isAdmin) {
            return null;
          }
          return (
            <Link href={link.link} key={`${index.toString()}link`} passHref>
              <Button
                mt={2}
                key={index.toString()}
                as={ChakraLink}
                w="95%"
                mx={'auto'}
                variant="ghost"
              >
                {link.name}
              </Button>
            </Link>
          );
        })}
        {user.isReviewer && <ReviewModal user={user} inMobileNav />}
        {user.isAdmin && <MovieModal inMobileNav />}
        <chakra.hr
          width="95%"
          my={4}
          mx="auto"
          borderColor={
            colorMode === 'light'
              ? `${process.env.COLOR_THEME}.500`
              : `${process.env.COLOR_THEME}.300`
          }
        />
        <Button
          mt={2}
          w="95%"
          mx={'auto'}
          //@ts-ignore
          bg={colorMode === 'light' ? lightBg : darkBg}
          variant="ghost"
          colorScheme={process.env.COLOR_THEME}
          onClick={() => signout()}
        >
          Sign Out
        </Button>
      </Flex>
      <Stack className="fixed bottom-20 right-6 z-[100] animate-[bounce_1s_5s]">
        {
          router.pathname !== '/' &&
          <IconButton
            isRound={true}
            variant='solid'
            colorScheme={process.env.COLOR_THEME}
            aria-label='Done'
            fontSize='20px'
            size='lg'
            icon={<IoHomeOutline />}
            onClick={() => {
              if (router?.pathname.includes('restaurant')) {
                setView('restaurants');
              }
              else if (router?.pathname.includes('movie')) {
                setView('movies');
              }
              router.push('/', undefined, { shallow: true })
            }
            }
          />
        }
        {
          router.pathname === '/' && view === 'movies' &&
          <IconButton
            isRound={true}
            variant='solid'
            colorScheme={process.env.COLOR_THEME}
            aria-label='Done'
            fontSize='20px'
            size='lg'
            icon={<IoRestaurantOutline />}
            onClick={() => {
              setView('restaurants');
            }}
          />
        }
        {
          router.pathname === '/' && view === 'restaurants' &&
          <IconButton
            isRound={true}
            variant='solid'
            colorScheme={process.env.COLOR_THEME}
            aria-label='Done'
            fontSize='20px'
            size='lg'
            icon={<BiCameraMovie />}
            onClick={() => {
              setView('movies');
            }}
          />
        }
      </Stack>
    </>
  ) : null;
};
