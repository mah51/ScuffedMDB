import React, { useMemo, useState } from 'react';
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
  useColorMode,
  useBreakpoint,
} from '@chakra-ui/react';
import { FaUserPlus, FaUserShield, FaUserSlash } from 'react-icons/fa';
import { useQueryClient } from 'react-query';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { SerializedUser } from '../../models/user';
import { getFlags } from '../../utils/userFlags';
import { format } from 'date-fns';
import { BsEyeSlashFill } from 'react-icons/bs';

//TODO look into types for react-table. It looks like a hot mess and i don't really know what im doing, so pretty much this whole file is ts-ignored lol

const Form = ({
  firstFieldRef,
  onCancel,
  user,
  isBanned,
  banReason,
}: {
  firstFieldRef: any;
  onCancel: any;
  user: string;
  isBanned: boolean;
  banReason?: string;
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [reason, setReason] = useState(``);
  const { colorMode } = useColorMode();
  const handleBan = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    usr: string
  ) => {
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
        <Text color={colorMode === 'light' ? `gray.600` : `gray.400`}>
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

const PopoverForm = ({
  user,
  isBanned,
  banReason,
}: {
  user: string;
  isBanned: boolean;
  banReason?: string;
}) => {
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

export const UserTable: React.FC<{
  users: SerializedUser[] | undefined;
}> = ({ users }): JSX.Element => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleReveal = async (user: string, isImageHidden: boolean) => {
    const response = await fetch(`/api/user/${user}`, {
      method: `PUT`,
      body: JSON.stringify({ isImageHidden: !isImageHidden }),
    });
    if (response.status >= 300) {
      return toast({
        variant: `top-accent`,
        title: `There was an error`,
        description: `${user} could not be revealed`,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
    } else {
      await queryClient.invalidateQueries(`users`);
      return toast({
        variant: `top-accent`,
        title: `Image visible`,
        description: `${user} image is now visible.`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePromote = async (
    promotion: 'admin' | 'reviewer',
    user: string
  ) => {
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
  const COLUMNS = () => [
    {
      Header: `User`,
      accessor: `username`,
      Cell: ({
        value,
      }: {
        value: {
          flags: string[];
          image: string;
          _id: string;
          username: string;
          discriminator: string;
          discord_id: string;
        };
      }) => (
        <Tooltip
          label={value?.flags.join(` ,`) || `No user flags`}
          placement="top"
        >
          <Flex justifyContent="center">
            <Avatar src={value?.image} />
            <VStack ml={3} alignItems="flex-start">
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URI}/user/${value?._id}`}
                isExternal
              >
                <Flex>
                  <Text fontSize="lg" fontWeight="semibold">
                    {value?.username}
                    <chakra.span
                      color={useColorModeValue(`gray.400`, `gray.600`)}
                    >
                      #{value?.discriminator}
                    </chakra.span>
                  </Text>
                  <ExternalLinkIcon mx="5px" my="auto" />
                </Flex>
              </Link>
              <Text
                fontSize="sm"
                color={useColorModeValue(`gray.400`, `gray.600`)}
              >
                {value?.discord_id}
              </Text>
            </VStack>
          </Flex>
        </Tooltip>
      ),
    },
    {
      Header: `Joined`,
      accessor: `createdAt`,
      Cell: ({ value }: { value: { joinedAt: string } }) => (
        <Text textAlign="center">
          {format(new Date(value?.joinedAt), 'dd/MM/yy - HH:mm:ss')}
        </Text>
      ),
    },
    {
      Header: `Last Login`,
      accessor: `updatedAt`,
      Cell: ({ value }: { value: { updatedAt: string } }) => {
        const updateDate = new Date(value?.updatedAt);
        return (
          <Text textAlign="center">
            {format(updateDate, 'dd/MM/yy - HH:mm:ss')}
          </Text>
        );
      },
    },
    {
      Header: `Actions`,
      accessor: `actionInfo`,
      Cell: ({
        value,
      }: {
        value: {
          isAdmin: boolean;
          _id: string;
          isReviewer: boolean;
          isBanned: boolean;
          banReason: string;
          isImageHidden: boolean;
        };
      }) => (
        <HStack justifyContent="center">
          <Tooltip
            label={
              value?.isImageHidden ? `Reveal user image` : `Hide user image`
            }
            placement="top"
          >
            <IconButton
              onClick={() => handleReveal(value?._id, value?.isImageHidden)}
              aria-label={
                value?.isImageHidden ? `Reveal user image` : `Hide user image`
              }
              colorScheme={value?.isImageHidden ? `red` : `green`}
              variant="ghost"
              icon={<BsEyeSlashFill />}
            />
          </Tooltip>
          <Tooltip
            label={value?.isAdmin ? `Demote from admin` : `Promote to admin`}
            placement="top"
          >
            <IconButton
              onClick={() => handlePromote(`admin`, value?._id)}
              aria-label={
                value?.isAdmin ? `Demote from admin` : `Promote to admin`
              }
              colorScheme={value?.isAdmin ? `red` : `green`}
              variant="ghost"
              icon={<FaUserShield />}
            />
          </Tooltip>
          <Tooltip
            label={
              value?.isReviewer ? `Demote from reviewer` : `Promote to reviewer`
            }
            placement="top"
          >
            <IconButton
              onClick={() => handlePromote(`reviewer`, value?._id)}
              aria-label={
                value?.isReviewer
                  ? `Demote from reviewer`
                  : `Promote to reviewer`
              }
              colorScheme={value?.isReviewer ? `red` : `green`}
              variant="ghost"
              icon={<FaUserPlus />}
            />
          </Tooltip>

          <PopoverForm
            isBanned={value?.isBanned}
            banReason={value?.banReason}
            user={value?._id}
          />
        </HStack>
      ),
    },
  ];

  const { colorMode } = useColorMode();
  const bp = useBreakpoint();

  const userData = users?.map((user) => ({
    username: {
      _id: user?._id?.toString(),
      username: user.username,
      image: user.image,
      discriminator: user.discriminator,
      discord_id: user.discord_id,
      flags: getFlags(user?.flags),
    },
    createdAt: {
      joinedAt: user?.createdAt,
    },
    updatedAt: {
      updatedAt: user?.updatedAt,
    },
    actionInfo: {
      _id: user?._id?.toString(),
      isAdmin: user?.isAdmin,
      isReviewer: user?.isReviewer,
      isBanned: user?.isBanned,
      banReason: user?.banReason || '',
      isImageHidden: user?.isImageHidden,
    },
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => COLUMNS(), []);
  const data = useMemo(() => userData, [userData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
  } = useTable({ columns, data });

  return (
    <chakra.div
      ml={'10px!important'}
      overflowX={['base', 'sm', 'md'].includes(bp || '') ? 'scroll' : 'hidden'}
      shadow="lg"
      maxW="full"
      borderRadius="xl"
      border="1px solid"
      borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
    >
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
    </chakra.div>
  );
};
