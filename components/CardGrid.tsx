import {
    Container,
    SimpleGrid,
    useDisclosure,
    Box,
    Flex,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    chakra,
    useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { useState } from "react";
import { Card } from "./Card";
import MovieDetailsModal from "./MovieDetailsModal";
import movie from "../pages/api/movie";

export const CardGrid = ({ movies: unSortedMovies, user }) => {
    const [modalMovie, setModalMovie] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("recent");
    const movies = {
        data: unSortedMovies.data
            ?.filter((mv) => {
                if (mv.name.toLowerCase().includes(filter)) {
                    return true;
                }
                return false;
            })
            .sort((a, b) => {
                if (sort === "recent" || sort === "old") {
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );
                } else if (sort === "best") {
                    return a.rating - b.rating;
                } else if (sort === "worst") {
                    return a.rating - b.rating;
                }
            }),
    };

    if (sort === "best" || sort === "recent") {
        movies.data = movies.data.reverse();
    }

    return (
        <>
            <MovieDetailsModal
                isOpen={isOpen}
                onClose={onClose}
                movie={modalMovie}
                user={user}
            />
            <Container maxW="container.xl" mt={10}>
                <Heading fontSize="6xl" textAlign="center">
                    We have watched{" "}
                    {
                        <chakra.span
                            color={useColorModeValue(
                                "purple.500",
                                "purple.300"
                            )}
                        >
                            {unSortedMovies?.data?.length}
                        </chakra.span>
                    }{" "}
                    movies
                </Heading>
                <Flex
                    width="full"
                    direction={{ base: "column", md: "row" }}
                    my={7}
                    justifyContent="space-between"
                >
                    <InputGroup maxWidth={["full", , "200px"]} mb={[5, , 0]}>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<AiOutlineSearch color="gray.300" />}
                        />
                        <Input
                            variant="filled"
                            type="text"
                            placeholder="Search"
                            onChange={(e) =>
                                setFilter(e.target.value.toLowerCase())
                            }
                        />
                    </InputGroup>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                            Sort by...
                        </MenuButton>
                        <MenuList zIndex={998}>
                            <MenuItem
                                zIndex={999}
                                isDisabled={sort === "recent"}
                                onClick={() => setSort("recent")}
                            >
                                Recent
                            </MenuItem>
                            <MenuItem
                                zIndex={999}
                                isDisabled={sort === "old"}
                                onClick={() => setSort("old")}
                            >
                                Old
                            </MenuItem>
                            <MenuItem
                                zIndex={999}
                                isDisabled={sort === "best"}
                                onClick={() => setSort("best")}
                            >
                                Best
                            </MenuItem>
                            <MenuItem
                                zIndex={999}
                                isDisabled={sort === "worst"}
                                onClick={() => setSort("worst")}
                            >
                                Worst
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={10}
                    alignItems="stretch"
                >
                    {movies?.data?.map((movie, i) => (
                        <Box
                            key={`${i.toString()}cardBox`}
                            height="full"
                            onClick={() => {
                                setModalMovie(movie);
                                return onOpen();
                            }}
                        >
                            <Card {...movie} key={`${i.toString()}card`} />
                        </Box>
                    ))}
                </SimpleGrid>
            </Container>
        </>
    );
};
