import {
  Container,
  SimpleGrid,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  chakra,
  useColorModeValue,
  useToast,
  useColorMode,
  Stack,
  IconButton,
  Tooltip,
  useBreakpoint,
  Popover,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Tag,
  Checkbox,
  Portal,
  PopoverFooter,
  useTheme,
} from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { useState } from 'react';
import { useEffect } from 'react';
import Card from '../Card';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { NextSeo } from 'next-seo';
import ReviewModal from '../ReviewModal';
import { UserAuthType } from 'next-auth';

import MovieGridView from '../MovieGridView';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { HiViewList } from 'react-icons/hi';
import { getColorSchemeCharCode, getMovieGenres } from '../../utils/utils';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ActiveHero from '@components/ActiveHero';

interface CardGridProps {
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  user: UserAuthType;
}

export const CardGrid: React.FC<CardGridProps> = ({
  movies: unSortedMovies,
  user,
}): React.ReactElement => {
  const bp = useBreakpoint();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const [cardView, setCardView] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [isGenreFilterActive, setIsGenreFilterActive] = useState(false);
  const featuredMovie = unSortedMovies[0]?._id;
  const toast = useToast();
  const { colorMode } = useColorMode();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`otherToast`, {
      variant: `subtle`,
      title: 'Movie not found',
      description: 'The shared movie does not exist',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [colorMode, toast]);

  const movies = {
    data: unSortedMovies
      ?.filter((mv) => {
        if (mv && mv.name.toLowerCase().includes(filter)) {
          return true;
        }

        return false;
      })
      .filter((mv) => {
        if (isGenreFilterActive) {
          return mv.genres.every((g) => genres.includes(g));
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === 'recent' || sort === 'old') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sort === 'best') {
          return a.rating - b.rating;
        } else if (sort === 'worst') {
          return a.rating - b.rating;
        }
        return 0;
      }),
  };

  if (sort === 'best' || sort === 'recent') {
    movies.data = movies.data.reverse();
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const handleGenreClick = (genre: string) => {
    setGenres((gnr) => {
      setIsGenreFilterActive(true);
      if (gnr.includes(genre)) {
        //remove genre
        const removedGenre = gnr.filter((g) => g !== genre);

        if (removedGenre.length === 0) {
          setIsGenreFilterActive(false);
        }
        return removedGenre;
      }

      return [...gnr, genre];
    });
  };
  const theme = useTheme();
  return (
    <>
      <NextSeo
        openGraph={{
          title: siteName,
          type: `website`,
          site_name: siteName,
          images: [
            {
              width: 2542,
              height: 1312,
              url: `https://www.movie.michael-hall.me/sitePicture.png`,
              alt: siteName + ' webpage',
            },
          ],
        }}
        description={'A private movie rating website'}
      />

      <Container
        maxW="container.xl"
        height="full"
        my={10}
        display="flex"
        flexDir="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <ActiveHero
          movie={
            unSortedMovies
              ?.sort((a, b) => {
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                );
              })
              .reverse()[0]
          }
        />
        <Heading
          mb={10}
          fontSize={{ base: '4xl', md: '6xl' }}
          textAlign="center"
        >
          We have watched{' '}
          {
            <chakra.span
              color={useColorModeValue(
                `${process.env.COLOR_THEME}.500`,
                `${process.env.COLOR_THEME}.300`
              )}
            >
              {unSortedMovies?.length}
            </chakra.span>
          }{' '}
          movie{unSortedMovies.length !== 1 ? 's' : ''}
        </Heading>

        <Flex
          width="full"
          direction={{ base: 'column', md: 'row' }}
          my={7}
          justifyContent="space-between"
        >
          <Flex mb={{ base: 4, md: 0 }}>
            {(user.isReviewer || user.isAdmin) && <ReviewModal user={user} />}
          </Flex>

          <Stack alignItems="stretch" direction={{ base: 'column', md: 'row' }}>
            <InputGroup maxWidth={{ base: 'full', md: '200px' }}>
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch color="gray.300" />
              </InputLeftElement>
              <Input
                variant="filled"
                type="text"
                placeholder="Search"
                onChange={(e) => setFilter(e.target.value.toLowerCase())}
              />
            </InputGroup>
            <Stack isInline alignItems="center">
              <Popover>
                <PopoverTrigger>
                  <Button rightIcon={<ChevronDownIcon />} isTruncated>
                    Filter by genre
                  </Button>
                </PopoverTrigger>
                <Portal>
                  {/* render into a portal to prevent the card underneath interfering with the popover */}
                  <PopoverContent zIndex={10000}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader ml="5px" fontWeight="bold">
                      Filter search by genre
                    </PopoverHeader>
                    <PopoverBody>
                      <Flex wrap="wrap">
                        {getMovieGenres(unSortedMovies).map(
                          (genre: string, i) => {
                            const genreColor = getColorSchemeCharCode(genre);
                            const dark = transparentize(
                              `${genreColor}.200`,
                              0.16
                            )(theme);
                            const light = transparentize(
                              `${genreColor}.500`,
                              0.2
                            )(theme);
                            return (
                              <Tag
                                mx="5px"
                                my="3px"
                                key={i.toString() + 'genreTag'}
                                fontWeight="semibold"
                                colorScheme={genreColor}
                                bg={colorMode === 'light' ? light : dark}
                                cursor="pointer"
                                userSelect="none"
                                onClick={() => handleGenreClick(genre)}
                              >
                                <Checkbox
                                  isChecked={genres.includes(genre)}
                                  colorScheme={genreColor}
                                  borderColor={`${genreColor}.300`}
                                  mr="4px"
                                  zIndex="-1"
                                  size="sm"
                                />
                                {genre}
                              </Tag>
                            );
                          }
                        )}
                      </Flex>
                    </PopoverBody>
                    <PopoverFooter display="flex" justifyContent="flex-end">
                      <Button
                        onClick={() => {
                          setGenres([]);
                          setIsGenreFilterActive(false);
                        }}
                      >
                        Clear All
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Portal>
              </Popover>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<BiChevronDown />}
                  isTruncated
                >
                  Sort by...
                </MenuButton>
                <MenuList zIndex={998}>
                  <MenuItem
                    zIndex={999}
                    isDisabled={sort === 'recent'}
                    onClick={() => setSort('recent')}
                  >
                    Recent
                  </MenuItem>
                  <MenuItem
                    zIndex={999}
                    isDisabled={sort === 'old'}
                    onClick={() => setSort('old')}
                  >
                    Old
                  </MenuItem>
                  <MenuItem
                    zIndex={999}
                    isDisabled={sort === 'best'}
                    onClick={() => setSort('best')}
                  >
                    Best
                  </MenuItem>
                  <MenuItem
                    zIndex={999}
                    isDisabled={sort === 'worst'}
                    onClick={() => setSort('worst')}
                  >
                    Worst
                  </MenuItem>
                </MenuList>
              </Menu>

              <Tooltip
                label="Toggle between card and table view"
                placement="top"
              >
                <Stack
                  isInline
                  bg={useColorModeValue('gray.100', 'whiteAlpha.200')}
                  height="full"
                  alignItems="center"
                  alignSelf="stretch"
                  px={1}
                  borderRadius="md"
                >
                  <IconButton
                    bg={
                      cardView
                        ? `${process.env.COLOR_THEME}.${
                            colorMode === 'light' ? 500 : 300
                          }`
                        : 'transparent'
                    }
                    size="sm"
                    onClick={() => setCardView(true)}
                    aria-label="Activate table mode"
                    colorScheme={cardView ? process.env.COLOR_THEME : 'gray'}
                    icon={<BsGrid3X3Gap size="1.1rem" />}
                  />
                  <IconButton
                    size="sm"
                    bg={
                      !cardView
                        ? `${process.env.COLOR_THEME}.300`
                        : 'transparent'
                    }
                    onClick={() => setCardView(false)}
                    aria-label="Activate table mode"
                    colorScheme={!cardView ? process.env.COLOR_THEME : 'gray'}
                    icon={<HiViewList size="1.1rem" />}
                  />
                </Stack>
              </Tooltip>
            </Stack>
          </Stack>
        </Flex>
        {movies?.data?.length > 0 ? (
          cardView ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              width="full"
              alignItems="stretch"
            >
              {movies?.data?.map(
                (
                  movie: SerializedMovieType<ReviewType<PopulatedUserType>[]>,
                  i
                ) => (
                  <Card
                    movie={movie}
                    key={`${i.toString()}card`}
                    featuredMovie={featuredMovie}
                  />
                )
              )}
            </SimpleGrid>
          ) : (
            <chakra.div
              overflowX={
                ['base', 'sm', 'md'].includes(bp || '') ? 'scroll' : 'hidden'
              }
              shadow="lg"
              maxW="full"
              borderRadius="xl"
              border="1px solid"
              borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
            >
              <MovieGridView
                user={user}
                movies={movies.data}
                featuredMovie={featuredMovie}
              />
            </chakra.div>
          )
        ) : (
          <Flex
            width="full"
            h="full"
            minH="200px"
            justifyContent="center"
            alignItems="center"
          >
            <Heading
              size={{ base: 'xl', md: '2xl', lg: '4xl' }[bp || 'base']}
              fontWeight="extrabold"
              color={
                colorMode === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'whiteAlpha.300'
              }
            >
              To get started add a movie.
            </Heading>
          </Flex>
        )}
      </Container>
    </>
  );
};
