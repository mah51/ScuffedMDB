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
  useColorMode,
  Stat,
  StatNumber,
  chakra,
  IconButton,
  Tooltip,
  VStack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { ReactElement, useMemo } from 'react';
import { CgDetailsMore } from 'react-icons/cg';
import { FaImdb } from 'react-icons/fa';
import { useTable } from 'react-table';
import { SerializedMovieType } from '../../models/movie';

interface Props {
  movies: SerializedMovieType[];
}

const COLUMNS = [
  {
    Header: 'Movie',
    accessor: 'info',
    Cell: ({
      value: { image, name, tagLine },
    }: {
      value: { name: string; image: string; tagLine: string };
    }) => {
      return (
        <Stack spacing={6} isInline alignItems="center">
          <AspectRatio ratio={16 / 9} width="150px" borderRadius="xl">
            <Image
              src={image}
              alt={`${name} poster`}
              layout="fill"
              className={'borderRadius-md'}
            />
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
      value: { rating, numReviews },
    }: {
      value: { rating: string; numReviews: number };
    }) => {
      return numReviews > 0 ? (
        <Stat textAlign="center">
          <StatNumber fontSize="3xl" fontWeight="bold">
            {rating}
            <chakra.span fontSize="md" fontWeight="normal" color={'gray.500'}>
              {' '}
              /10
            </chakra.span>{' '}
            <chakra.span fontSize="md">{numReviews}</chakra.span>
            <chakra.span fontSize="md" fontWeight="normal" color={'gray.500'}>
              {' '}
              vote{numReviews !== 1 && 's'}
            </chakra.span>
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
      value: { imdbID, movieID },
    }: {
      value: { imdbID: string; movieID: string };
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
        </Stack>
      );
    },
  },
];

export default function MovieGridView({ movies }: Props): ReactElement {
  const moviesData = movies.map((movie) => ({
    info: {
      name: movie.name,
      image: movie.image,
      tagLine: movie.tagLine,
    },
    rating: { rating: movie.rating, numReviews: movie.numReviews },
    actionInfo: { imdbID: movie.imdbID, movieID: movie._id },
  }));
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => moviesData, [moviesData]);
  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  const { colorMode } = useColorMode();

  return (
    <Table
      border={'1px solid'}
      borderColor={useColorModeValue('gray.100', 'gray.900')}
      {...getTableProps()}
    >
      <Thead>
        {headerGroups.map((headerGroup, i) => (
          <Tr
            {...headerGroup.getHeaderGroupProps()}
            key={i.toString() + 'heading'}
          >
            {headerGroup.headers.map((header, j) => (
              <Th
                {...header.getHeaderProps()}
                key={j.toString + ' header'}
                borderColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
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
                  <Td
                    {...cell.getCellProps()}
                    key={i.toString() + 'Cell'}
                    borderColor={
                      colorMode === 'light' ? 'gray.100' : 'gray.900'
                    }
                  >
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
