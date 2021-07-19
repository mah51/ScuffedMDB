import {
  AspectRatio,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  useColorModeValue,
  Stat,
  StatNumber,
  chakra,
  IconButton,
  Tooltip,
  VStack,
  Text,
  AvatarGroup,
  Avatar,
  useToast,
  PopoverTrigger,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Button,
  PopoverHeader,
  Skeleton,
} from '@chakra-ui/react';
import { UserAuthType } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactElement, useMemo } from 'react';
import { CgDetailsMore } from 'react-icons/cg';
import { FaImdb } from 'react-icons/fa';
import { IoTrashBinOutline } from 'react-icons/io5';
import { useQueryClient } from 'react-query';
import { useTable } from 'react-table';
import { SerializedMovieType } from '../../models/movie';

interface Props {
  movies: SerializedMovieType[];
  user: UserAuthType;
}

const COLUMNS = (
  user: UserAuthType,
  handleMovieDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    movieID: string
  ) => void
) => [
  {
    Header: 'Movie',
    accessor: 'info',
    Cell: ({
      value: { image, name, tagLine },
    }: {
      value: { name: string; image: string; tagLine: string };
    }) => {
      const [loaded, setLoaded] = React.useState(false);
      return (
        <Stack spacing={6} isInline alignItems="center">
          <AspectRatio ratio={16 / 9} width="150px" borderRadius="xl">
            <Skeleton borderRadius="md" isLoaded={loaded}>
              <Image
                src={image}
                alt={`${name} poster`}
                layout="fill"
                sizes={'150px'}
                onLoad={() => setLoaded(true)}
                className={'borderRadius-md'}
              />
            </Skeleton>
          </AspectRatio>
          <VStack alignItems="flex-start">
            <Heading size="lg">{name}</Heading>
            <Text color="gray.500" fontWeight="semibold">
              {tagLine || 'No tag line'}
            </Text>
          </VStack>
        </Stack>
      );
    },
  },
  {
    Header: 'Rating',
    accessor: 'rating',
    Cell: ({
      value: { rating, reviews },
    }: {
      value: { rating: string; reviews: { name: string; image: string }[] };
    }) => {
      return reviews.length > 0 ? (
        <Stat textAlign="center">
          <StatNumber
            alignItems="center"
            display="flex"
            fontSize="3xl"
            fontWeight="bold"
            justifyContent="center"
          >
            {rating}
            <chakra.span fontSize="md" fontWeight="normal" color={'gray.500'}>
              {' '}
              /10
            </chakra.span>
            <AvatarGroup ml={3} max={3} size="md">
              {reviews.map((review, i) => (
                <Avatar
                  src={review.image}
                  key={i.toString() + 'avatar'}
                  name={review.name}
                />
              ))}
            </AvatarGroup>
          </StatNumber>
        </Stat>
      ) : (
        <Heading width="full" textAlign="center" size="md">
          No reviews
        </Heading>
      );
    },
  },
  {
    Header: 'Actions',
    accessor: 'actionInfo',
    Cell: ({
      value: { imdbID, movieID, name },
    }: {
      value: { imdbID: string; movieID: string; name: string };
    }) => {
      return (
        <Stack isInline width="full" justifyContent="center">
          <Tooltip
            label="View more info"
            aria-label="View more info"
            hasArrow
            placement="top"
          >
            <IconButton
              href={`${process.env.NEXT_PUBLIC_APP_URI}/movie/${movieID}`}
              aria-label="View more info"
              size="2xl"
              p={2}
              as={'a'}
              icon={<CgDetailsMore size="3em" />}
              colorScheme="purple"
              variant="ghost"
            />
          </Tooltip>
          <Tooltip
            label="View on IMDB"
            aria-label="View on IMDB"
            hasArrow
            placement="top"
          >
            <IconButton
              href={`https://imdb.com/title/${imdbID}`}
              aria-label="View on IMDB"
              size="2xl"
              p={2}
              as={'a'}
              target="_blank"
              icon={<FaImdb size="3em" />}
              variant="IMDB"
            />
          </Tooltip>

          {user.isAdmin && (
            <Popover closeOnBlur={true}>
              <Tooltip
                label="Delete movie"
                aria-label="Delete movie"
                hasArrow
                placement="top"
              >
                <span>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Delete movie"
                      size="2xl"
                      p={2}
                      variant="ghost"
                      colorScheme="red"
                      icon={<IoTrashBinOutline size="3em" />}
                    />
                  </PopoverTrigger>
                </span>
              </Tooltip>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontSize="2xl" p={4} fontWeight="bold">
                  Delete {name}?
                </PopoverHeader>
                <PopoverBody
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  width="full"
                  height="full"
                >
                  <Button
                    ml={3}
                    colorScheme="red"
                    onClick={(e) => handleMovieDelete(e, movieID)}
                  >
                    Delete
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Stack>
      );
    },
  },
];

export default function MovieGridView({ movies, user }: Props): ReactElement {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleMovieDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    movieID: string
  ): Promise<void> => {
    e.preventDefault();
    try {
      close();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`,
        {
          method: `delete`,
          // eslint-disable-next-line no-underscore-dangle
          body: JSON.stringify({ id: movieID }),
        }
      );
      const data = await response.json();

      if (response.status !== 200) {
        toast({
          variant: `subtle`,
          title: `There was an error`,
          description: data.message,
          status: `error`,
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      await queryClient.invalidateQueries(`movies`);
      router.push('/');
      toast({
        variant: `subtle`,
        title: `Movie Deleted`,
        description: `${data.name} was deleted successfully :)`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        variant: `subtle`,
        title: `There was an error`,
        description: err.message,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const moviesData = movies.map((movie) => ({
    info: {
      name: movie.name,
      image: movie.image,
      tagLine: movie.tagLine,
    },
    rating: {
      rating: movie.rating,
      reviews: movie.reviews.map((review) => ({
        name: review.user?.username,
        image: review.user?.image,
      })),
    },
    actionInfo: { imdbID: movie.imdbID, movieID: movie._id, name: movie.name },
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => COLUMNS(user, handleMovieDelete), [user]);
  const data = useMemo(() => moviesData, [moviesData]);
  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
  } = useTable({ columns, data });

  return (
    <Table {...getTableProps()}>
      <Thead
        bg={useColorModeValue('gray.50', 'gray.900')}
        borderBottom="1px solid"
        shadow="md"
        borderColor={useColorModeValue('gray.300', 'gray.700')}
      >
        {headerGroups.map((headerGroup, i) => (
          <Tr
            {...headerGroup.getHeaderGroupProps()}
            key={i.toString() + 'heading'}
          >
            {headerGroup.headers.map((header, j) => (
              <Th
                {...header.getHeaderProps()}
                key={j.toString() + ' header'}
                py={7}
                fontSize="md"
                textAlign="center"
              >
                {header.render('Header')}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {' '}
        {rows.map((row, j) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()} key={j.toString() + 'Row'}>
              {row.cells.map((cell, i) => {
                return (
                  <Td {...cell.getCellProps()} key={i.toString() + 'Cell'}>
                    {cell.render('Cell')}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
