import React from 'react';
import { useTable } from 'react-table';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  Flex,
  Image,
  Text,
  Avatar,
  VStack,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';

function UserTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: `User`,
        accessor: `username`,
        Cell: ({ row }) => (
          <Tooltip label={row?.original?.flags.join(` ,`)} placement="top">
            <Flex justifyContent="center">
              <Avatar src={row?.original?.image} />
              <VStack ml={3} alignItems="flex-start">
                <Text fontSize="lg" fontWeight="semibold">
                  {row?.original?.username}
                </Text>
                <Text
                  fontSize="sm"
                  color={useColorModeValue(`gray.400`, `gray.600`)}
                >
                  {row?.original?.id}
                </Text>
              </VStack>
            </Flex>
          </Tooltip>
        ),
      },
      {
        Header: `Joined`,
        accessor: `createdAt`,
      },
      {
        Header: `Last Login`,
        accessor: `updatedAt`,
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                textAlign="center"
                {...column.getHeaderProps(column)}
                isNumeric={column.isNumeric}
              >
                {column.render(`Header`)}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td
                  {...cell.getCellProps()}
                  isNumeric={cell.column.isNumeric}
                  textAlign="center"
                >
                  {cell.render(`Cell`)}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

export default UserTable;
