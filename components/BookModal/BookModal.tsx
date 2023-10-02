import React, { FormEvent, useState } from 'react';
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
    useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { YelpMatchResponse } from "../../pages/api/restaurant-api";
import { SearchResponse, ItemSchema } from 'models/api/books/googleBooksResponse';



function SkeletonImage({ data }: { data: YelpMatchResponse }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <AspectRatio
            ratio={16 / 9}
            width="full"
        >
            <Skeleton isLoaded={imageLoaded} width="full" height="full">
                <Image
                    onLoad={() => setImageLoaded(true)}
                    alt={`${data?.name}`}
                    layout="fill"
                    src={`${data?.image_url}`}
                    objectFit='cover'
                />
            </Skeleton>
        </AspectRatio>
    );
}

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

        const [showForm, setShowForm] = useState(true);
        const [query, setQuery] = useState('');
        const [searchResults, setSearchResults] = useState<ItemSchema | null>(null);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
                const url = `${process.env.NEXT_PUBLIC_APP_URI}/api/book-api?key=${query}`;
                const response = await fetch(url);
                if (response.status === 200) {
                    const data: SearchResponse = await response.json();
                    console.log(data.totalItems);
                }
                else {
                    setError("No results found...")
                }
            }
            catch (err) {
                console.error(err);
                if (err) {
                    setError(err?.message);
                }
            }
        };

        const addBook = async () => {
            console.log('Add book')
        }


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
