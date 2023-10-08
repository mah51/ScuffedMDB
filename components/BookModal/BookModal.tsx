import React, { FormEvent, useEffect, useState } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    VStack,
    Skeleton,
    AspectRatio,
    Heading,
    HStack,
    Text,
    Box,
    Select,
    useColorMode,
    Input,
    InputGroup,
    InputLeftElement,
    ModalFooter,
    ModalBody,
    useColorModeValue,
    Center,
    Spinner,
    IconButton
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { SearchResponse, ItemSchema } from 'models/api/books/googleBooksResponse';
import { OpenLibSchema } from 'models/api/books/openLibrarySchema';
import { BookType } from 'models/book';


export const BookModal: React.FC<{
    isBookOpen: any,
    onBookClose: any,
    setError: any,
    setSuccess: any
}> = ({
    isBookOpen,
    onBookClose,
    setError,
    setSuccess
}): React.ReactElement => {

        // Form states
        const { colorMode } = useColorMode();
        const [query, setQuery] = useState('');
        const [loading, setLoading] = useState(false);
        const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            try {
                const url = `${process.env.NEXT_PUBLIC_APP_URI}/api/book/google?key=${query}`;
                const response = await fetch(url);
                if (response.status === 200) {
                    const data: SearchResponse = await response.json();
                    setSearchResults(data);
                }
                else {
                    setError("No results found...")
                }
            }
            catch (err) {
                console.error(err);
                if (err) {
                    setError(err?.message ?? "Error searching for book");
                }
            }
            finally {
                setLoading(false);
            }
        };


        return (
            <>
                <Modal isOpen={isBookOpen} onClose={onBookClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add a book</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleSubmit}>
                                <FormControl isRequired>
                                    <Flex>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <SearchIcon color="gray.300" />
                                            </InputLeftElement>
                                            <Input
                                                name="book-search"
                                                type="text"
                                                placeholder="Search books..."
                                                onChange={e => setQuery(e.currentTarget.value)}
                                            />
                                        </InputGroup>
                                        <Button
                                            type="submit"
                                            ml={5}
                                            colorScheme={process.env.COLOR_THEME}
                                        >
                                            Search
                                        </Button>
                                    </Flex>
                                </FormControl>
                            </form>
                            {
                                searchResults &&
                                <BookSearchResult data={searchResults} loading={loading} setSuccess={setSuccess} setError={setError} onClose={onBookClose} />
                            }
                        </ModalBody>
                        <ModalFooter
                            bg={useColorModeValue(`gray.50`, `gray.800`)}
                            roundedBottom="md"
                        >
                            <Button colorScheme={process.env.COLOR_THEME} onClick={onBookClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
    }


function BookSearchResult({ data, loading, setSuccess, setError, onClose }: any) {

    const addBook = async (result: ItemSchema) => {
        try {
            const options = {
                method: 'post',
                body: JSON.stringify(result)
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URI}/api/book`, options);
            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                setSuccess(data);
                onClose();
            }
        }
        catch {
            setError(data?.message ?? "An error occured");
        }
    }

    return loading ? (
        <Center>
            <Spinner
                mt={6}
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color={`${process.env.COLOR_THEME}.200`}
                size="xl"
            />
        </Center>
    ) : (
        <VStack mt={10} spacing={4} align="stretch">
            {data?.items?.slice(0, 5).map((result: ItemSchema, index: number) => (
                <Flex
                    key={index.toString()}
                    justifyContent="stretch"
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius={10}
                    position="relative"
                >
                    <IconButton
                        size="xs"
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme={process.env.COLOR_THEME}
                        aria-label="Search database"
                        icon={<AddIcon />}
                        onClick={async () => addBook(result)}
                    />
                    <AspectRatio
                        ratio={16 / 9}
                        maxWidth="150px"
                        width="full"
                        minWidth="150px"
                    >
                        <SkeletonImage data={result} key={index.toString()} />
                    </AspectRatio>

                    <VStack align={'left'} maxWidth="53%">
                        <Heading fontSize="md">
                            {result?.volumeInfo?.title}
                        </Heading>
                        <Text fontSize='sm'>
                            {result?.volumeInfo?.authors && result?.volumeInfo?.authors[0]}
                        </Text>
                        <Text fontSize='xs' noOfLines={3}>
                            {result?.searchInfo?.textSnippet && new DOMParser().parseFromString(result?.searchInfo?.textSnippet, 'text/html').body.textContent}
                        </Text>
                    </VStack>
                </Flex>
            ))}
        </VStack>
    )
}


function SkeletonImage({ data }: { data: ItemSchema }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [image, setImage] = useState<String | undefined>();

    useEffect(() => {
        if (data?.volumeInfo?.imageLinks?.thumbnail) {
            setImage(data?.volumeInfo?.imageLinks?.thumbnail);
        }
        else {
            setImage('/no_image.jpg');
        }
    }, [])

    return (
        <AspectRatio
            ratio={16 / 9}
            width="full"
        >
            <Skeleton isLoaded={imageLoaded} width="full" height="full">
                <Image
                    onError={() => setImage('/no_image.jpg')}
                    onLoad={() => setImageLoaded(true)}
                    alt={`${data?.volumeInfo?.title}`}
                    layout="fill"
                    src={image}
                    objectFit='scale-down'
                />
            </Skeleton>
        </AspectRatio>
    );
}
