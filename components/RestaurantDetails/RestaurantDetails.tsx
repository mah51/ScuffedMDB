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
import { IoChevronDown } from 'react-icons/io5';
import React, { ReactElement, useContext, useState, useEffect } from 'react';
import { ReviewType, SerializedRestaurantType } from 'models/restaurant';
import { PopulatedUserType } from 'models/user';
import { UserAuthType } from 'next-auth';
import useScrollPosition from 'hooks/useScrollPosition.hook';
import Image from 'next/image';
import { getColorSchemeCharCode } from 'utils/utils';


interface Props {
    restaurant: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>;
    user: UserAuthType;
}

export default function RestaurantDetails({ restaurant, user }: Props): any {
    const bp = useBreakpoint();
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const { scrollPosition } = useScrollPosition();

    useEffect(() => {
        setIsImageLoaded(false);
    }, []);

    return (
        <Flex maxWidth="7xl" mx='10vw' mt="10px">
            <Flex
                direction="column"
                width="full"
                justifyContent="center"
                mt={{
                    base: 'max(-80px,-1vh)',
                    xl: '5vh',
                    '2xl': '10vh',
                    '4xl': '12em',
                }}
            >
                {bp && !['base', 'sm', 'md', 'lg'].includes(bp) && (
                    <Flex
                        direction="column"
                        alignItems="center"
                        position="absolute"
                        bottom={'60px'}
                        left={'50%'}
                        transform={'translateX(-50%)'}
                        color={'gray.500'}
                        visibility={scrollPosition ? 'hidden' : 'visible'}
                        opacity={scrollPosition ? 0 : 1}
                        transition={'all 0.25s'}
                    >
                        <Text fontWeight="semibold">Scroll to see reviews</Text>
                        <Icon
                            className="bouncing-arrow"
                            as={(props) => <IoChevronDown strokeWidth="20" {...props} />}
                            height={6}
                            mt={2}
                            width={6}
                        />
                    </Flex>
                )}
                <Box minHeight="calc(100vh - 80px)">
                    <Flex direction={{ base: 'column', lg: 'row' }}>
                        <Flex
                            width={{ base: '90%', lg: '50%' }}
                            mx="auto"
                            maxWidth="full"
                            alignItems="center"
                            pr={{ base: 0, lg: '20px' }}
                        >
                            <AspectRatio
                                borderRadius="xl"
                                shadow={'6px 8px 19px 4px rgba(0, 0, 0, 0.25)'}
                                ratio={10 / 5}
                                width="full"

                            >
                                <Skeleton borderRadius="xl" isLoaded={isImageLoaded}>
                                    <Image
                                        className={'borderRadius-xl'}
                                        src={restaurant?.image_url}
                                        alt={`${restaurant.name} poster`}
                                        sizes={'50vw'}
                                        layout="fill"
                                        onLoad={() => setIsImageLoaded(true)}
                                    />
                                </Skeleton>
                            </AspectRatio>
                        </Flex>
                        <VStack
                            // mx="auto"
                            pl={{ base: 0, lg: '20px' }}
                            alignItems="flex-start"
                            maxWidth={{ base: '90%', lg: '50%' }}
                        >
                            <Stack spacing={3} mt={{ base: '5', lg: 0 }} isInline>
                                {restaurant?.categories?.map((category, i) => {
                                    return (
                                        <Tag
                                            size={isLargerThan800 ? 'md' : 'sm'}
                                            key={i.toString()}
                                            colorScheme={getColorSchemeCharCode(category.alias)}
                                        >
                                            <TagLabel fontWeight={'600'}> {category.title}</TagLabel>
                                        </Tag>
                                    );
                                })}
                            </Stack>
                            <Heading
                                lineHeight="1.1em"
                                transform={'translateX(-3px)'}
                                fontSize="6xl"
                            >
                                {restaurant.name}
                            </Heading>
                            <Text
                                fontSize="lg"
                                fontStyle="italic"
                                color={'gray.500'}
                                fontWeight="bold"
                            >
                                {restaurant.display_phone}
                            </Text>
                            <Flex
                                justifyContent="space-between"
                                width="full"
                                mt={{ base: '20px!important', lg: 'auto!important' }}
                            >
                                <VStack spacing={1}>
                                    <Text color={'gray.500'} fontSize="sm">
                                        Address
                                    </Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {restaurant?.address[0]}
                                    </Text>
                                </VStack>
                                <VStack spacing={1}>
                                    <Text color={'gray.500'} fontSize="sm">
                                        City
                                    </Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {restaurant?.address[1]}
                                    </Text>
                                </VStack>
                                <VStack spacing={1}>
                                    <Text color={'gray.500'} fontSize="sm">
                                        Price
                                    </Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        {restaurant?.price}
                                    </Text>
                                </VStack>
                            </Flex>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    )
}