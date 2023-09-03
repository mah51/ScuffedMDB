import { UserAuthType } from 'next-auth';
import { ReviewType, SerializedMovieType } from 'models/movie';
import { SerializedRestaurantType } from 'models/restaurant';
import { PopulatedUserType } from 'models/user';
import React, { ReactElement, useContext, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { ReviewModalContext } from 'utils/ModalContext';
import { SettingsIcon, ArrowBackIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Flex,
    Box,
    AspectRatio,
    Tag,
    Stack,
    TagLabel,
    useMediaQuery,
    Heading,
    VStack,
    Text,
    chakra,
    StatGroup,
    Stat,
    StatLabel,
    StatNumber,
    Button,
    Icon,
    useBreakpoint,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuDivider,
    useColorMode,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    useColorModeValue,
    Skeleton,
} from '@chakra-ui/react';

export default function AdminOptions({
    user,
    movie,
    restaurant,
}: {
    user: UserAuthType;
    movie?: SerializedMovieType<ReviewType<PopulatedUserType>[]>;
    restaurant?: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>;
}) {
    const { colorMode } = useColorMode();

    const { onOpen: reviewOnOpen, setMovie: setModalMovie, setRestaurant: setModalRestaurant } = useContext(
        ReviewModalContext
    );
    const toast = useToast();

    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleMovieDelete = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`,
                {
                    method: `delete`,
                    // eslint-disable-next-line no-underscore-dangle
                    body: JSON.stringify({ id: movie?._id }),
                }
            );
            const data = await response.json();

            if (response.status !== 200) {
                return toast({
                    variant: `subtle`,
                    title: `There was an error`,
                    description: data.message,
                    status: `error`,
                    duration: 5000,
                    isClosable: true,
                });
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
    return (
        <Stack
            isInline
            justifyContent="space-between"
            mb={3}
            maxWidth={{ base: '100%', lg: 'full' }}
            mx="auto"
        >
            <Button
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                colorScheme={process.env.COLOR_THEME}
                onClick={() => router.push('/')}
            >
                Back to home
            </Button>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete {movie?.name}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? This is permanent, the movie and{' '}
                            {movie?.reviews.length} review
                            {movie?.reviews.length !== 1 && 's'} will be deleted
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    onClose();
                                    return handleMovieDelete();
                                }}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {
                (movie || restaurant) &&
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<SettingsIcon />}
                        variant="outline"
                    />
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                if (movie) {
                                    setModalMovie(movie);
                                }
                                else if (restaurant) {
                                    setModalRestaurant(restaurant)
                                }
                                return reviewOnOpen();
                            }}
                            icon={
                                !movie.reviews.find((rvw) => rvw.user?._id === user.sub) ? (
                                    <AddIcon />
                                ) : (
                                    <EditIcon />
                                )
                            }
                        >
                            {!movie.reviews.find((rvw) => rvw.user?._id === user.sub)
                                ? 'Add Review'
                                : 'Edit Review'}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                toast({
                                    variant: 'subtle',
                                    title: 'Copied to clipboard',
                                    description: `${movie?.name} copied to clipboard`,
                                    isClosable: true,
                                    duration: 5000,
                                    status: 'success',
                                });
                                navigator.clipboard.writeText(
                                    `${process.env.NEXT_PUBLIC_APP_URI}/movie/${movie?._id}`
                                );
                            }}
                            icon={<ExternalLinkIcon />}
                        >
                            Share
                        </MenuItem>
                        {user.isAdmin && (
                            <>
                                <MenuDivider />

                                <MenuItem
                                    color={colorMode === 'light' ? 'red.500' : 'red.300'}
                                    icon={<EditIcon />}
                                    onClick={() => setIsOpen(true)}
                                >
                                    Delete
                                </MenuItem>
                            </>
                        )}
                    </MenuList>
                </Menu>
            }
        </Stack>
    );
};