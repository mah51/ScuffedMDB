import React, { useState } from 'react';
import { useTable } from 'react-table';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  chakra,
  Text,
  Avatar,
  VStack,
  useColorModeValue,
  Tooltip,
  HStack,
  IconButton,
  useToast,
  Popover,
  PopoverTrigger,
  Input,
  Stack,
  useDisclosure,
  ButtonGroup,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Link,
} from '@chakra-ui/react';
import { FaUserPlus, FaUserShield, FaUserSlash } from 'react-icons/fa';
import { useQueryClient } from 'react-query';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const Form = ({ firstFieldRef, onCancel, user, isBanned, banReason }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [reason, setReason] = useState(``);
  const handleBan = async (e, usr) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URI}/api/user/`,
      {
        method: `delete`,
        body: JSON.stringify({ user: usr, reason }),
      }
    );
    const resData = await response.json();
    if (response.status === 200) {
      toast({
        variant: `top-accent`,
        title: `User ${resData.user.isBanned ? `Banned` : `Unbanned`}!`,
        description: `${resData.user.username} was ${
          resData.user.isBanned ? `banned` : `unbanned`
        } successfully`,
        status: `success`,
        isClosable: true,
      });
      await queryClient.invalidateQueries(`users`);
    } else {
      toast({
        variant: `top-accent`,
        title: `There was an error ${response.status}`,
        description: resData?.message || `No reason provided`,
        status: `error`,
        isClosable: true,
      });
    }
  };
  if (isBanned) {
    return (
      <Stack spacing={4}>
        <Text>Ban Reason</Text>
        <Text color={useColorModeValue(`gray.600`, `gray.400`)}>
          {banReason}
        </Text>
        <ButtonGroup d="flex" justifyContent="center">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={(e) => {
              onCancel();
              return handleBan(e, user);
            }}
          >
            Unban user!
          </Button>
        </ButtonGroup>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <FormControl id="ban-reason">
        <FormLabel>Ban reason</FormLabel>
        <Input
          type="text"
          placeholder="They smell funny"
          ref={firstFieldRef}
          onChange={(e) => setReason(e.target.value)}
        />
        <FormHelperText textAlign="left">
          Provide a reason for your ban...
        </FormHelperText>
      </FormControl>

      <ButtonGroup d="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          colorScheme="red"
          onClick={(e) => {
            onCancel();
            return handleBan(e, user);
          }}
        >
          Ban user!
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

const PopoverForm = ({ user, isBanned, banReason }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);

  return (
    <>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="auto"
      >
        <Tooltip label={isBanned ? `Unban user` : `Ban User`} placement="top">
          <span>
            <PopoverTrigger>
              <IconButton
                aria-label="Ban User"
                colorScheme={isBanned ? `red` : `green`}
                variant="ghost"
                onClick={onOpen}
                icon={<FaUserSlash />}
              />
            </PopoverTrigger>
          </span>
        </Tooltip>

        <PopoverContent p={5}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Form
            isBanned={isBanned}
            banReason={banReason}
            user={user}
            firstFieldRef={firstFieldRef}
            onCancel={onClose}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export const UserTable = ({ data }) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const handlePromote = async (promotion: 'admin' | 'reviewer', user) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URI}/api/user/`,
      { method: `put`, body: JSON.stringify({ promotion, user }) }
    );

    const resData = await response.json();
    if (response.status === 200) {
      toast({
        variant: `top-accent`,

        title: `User updated!`,
        description: `User received an ${resData.update}`,
        status: `success`,
        isClosable: true,
      });
      await queryClient.invalidateQueries(`users`);
    } else {
      toast({
        variant: `top-accent`,
        title: `There was an error ${response.status}`,
        description: resData?.message || `No reason provided`,
        status: `error`,
        isClosable: true,
      });
    }
  };
  const columns = React.useMemo(
    () => [
      {
        Header: `User`,
        accessor: `username`,
        Cell: ({ row }) => (
          <Tooltip
            label={row?.original?.flags.join(` ,`) || `No user flags`}
            placement="top"
          >
            <Flex justifyContent="center">
              <Avatar src={row?.original?.image} />
              <VStack ml={3} alignItems="flex-start">
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URI}/user/${row.original._id}`}
                  isExternal
                >
                  <Flex>
                    <Text fontSize="lg" fontWeight="semibold">
                      {row?.original?.username}
                      <chakra.span
                        color={useColorModeValue(`gray.400`, `gray.600`)}
                      >
                        #{row?.original?.discriminator}
                      </chakra.span>
                    </Text>
                    <ExternalLinkIcon mx="5px" my="auto" />
                  </Flex>
                </Link>
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
      {
        Header: `Actions`,
        Cell: ({ row }) => (
          <HStack justifyContent="center">
            <Tooltip
              label={
                row.original.isAdmin ? `Demote from admin` : `Promote to admin`
              }
              placement="top"
            >
              <IconButton
                onClick={() => handlePromote(`admin`, row.original._id)}
                aria-label={
                  row.original.isAdmin
                    ? `Demote from admin`
                    : `Promote to admin`
                }
                colorScheme={row.original.isAdmin ? `red` : `green`}
                variant="ghost"
                icon={<FaUserShield />}
              />
            </Tooltip>
            <Tooltip
              label={
                row.original.isReviewer
                  ? `Demote from reviewer`
                  : `Promote to reviewer`
              }
              placement="top"
            >
              <IconButton
                onClick={() => handlePromote(`reviewer`, row.original._id)}
                aria-label={
                  row.original.isReviewer
                    ? `Demote from reviewer`
                    : `Promote to reviewer`
                }
                colorScheme={row.original.isReviewer ? `red` : `green`}
                variant="ghost"
                icon={<FaUserPlus />}
              />
            </Tooltip>

            <PopoverForm
              isBanned={row.original.isBanned}
              banReason={row.original.banReason}
              user={row.original._id}
            />
          </HStack>
        ),
      },
    ],
    []
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
          <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup}>
            {headerGroup.headers.map((column) => (
              <Th
                key={column}
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
            <Tr {...row.getRowProps()} key={row}>
              {row.cells.map((cell) => (
                <Td
                  key={cell}
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
};
