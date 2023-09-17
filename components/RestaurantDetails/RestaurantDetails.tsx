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
    Spacer,
    HStack,
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { IoChevronDown, IoLocationOutline } from 'react-icons/io5';
import { FaYelp, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import React, { ReactElement, useContext, useState, useEffect } from 'react';
import { ReviewType, SerializedRestaurantType } from 'models/restaurant';
import { PopulatedUserType } from 'models/user';
import { UserAuthType } from 'next-auth';
import useScrollPosition from 'hooks/useScrollPosition.hook';
import Image from 'next/image';
import { getColorSchemeCharCode } from 'utils/utils';
import AdminOptions from 'components/AdminOptions';
import { PhoneIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { StarRating } from '@components/Rating/Rating';
import Link from 'next/link';


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
        <Flex maxWidth="7xl" mx={'auto'} mt="10px">
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
                mx={{
                    lg: '2vw'
                }}
            >
                <Box minHeight="calc(100vh - 80px)">
                    <AdminOptions user={user} restaurant={restaurant} />
                    <VStack align='stretch' className='m-2'>
                        <AspectRatio borderRadius="xl"
                            shadow={'6px 8px 19px 4px rgba(0, 0, 0, 0.25)'}
                            ratio={16 / 9}
                            width={{
                                base: '90vw',
                                lg: 'auto'
                            }} className='mb-4'>
                            <Skeleton borderRadius="xl" isLoaded={isImageLoaded}>
                                {
                                    restaurant?.image_url ?
                                        <Image
                                            src={restaurant?.image_url}
                                            alt={`${restaurant?.name} Image`}
                                            objectFit='cover'
                                            sizes={'50vw'}
                                            layout='fill'
                                            onLoad={() => setIsImageLoaded(true)}
                                        />
                                        :
                                        <Image
                                            src={`/svg/logo-no-background-${process.env.COLOR_THEME}.svg`}
                                            alt={`${restaurant?.name} Image`}
                                            objectFit='cover'
                                            sizes={'50vw'}
                                            layout='fill'
                                            onLoad={() => setIsImageLoaded(true)}
                                        />
                                }
                            </Skeleton>
                        </AspectRatio>
                        <Wrap spacing={3} mt={{ base: '5', lg: 0 }}>
                            {restaurant?.categories?.map((category, i) => {
                                return (
                                    <WrapItem key={i.toString()}>
                                        <Tag
                                            size={isLargerThan800 ? 'md' : 'sm'}
                                            colorScheme={getColorSchemeCharCode(category.alias)}
                                        >
                                            <TagLabel fontWeight={'600'}> {category?.title}</TagLabel>
                                        </Tag>
                                    </WrapItem>
                                );
                            })}
                            {
                                restaurant?.price &&
                                <WrapItem>
                                    <Tag size={isLargerThan800 ? 'md' : 'sm'}>
                                        {restaurant.price}
                                    </Tag>
                                </WrapItem>
                            }
                        </Wrap>
                        <Flex align='center'>
                            <Box w='50vw'>
                                <Heading
                                    lineHeight="1.1em"
                                    transform={'translateX(-3px)'}
                                    fontSize={{
                                        'base': '3xl',
                                        'lg': '6xl'
                                    }}
                                >
                                    {restaurant?.name}
                                </Heading>
                            </Box>
                            {
                                restaurant?.url &&
                                <Box>
                                    <Link href={restaurant?.url} passHref>
                                        <IconButton
                                            mt={'auto'}
                                            aria-label="View on Yelp"
                                            size="xl"
                                            p={2}
                                            as={'a'}
                                            target="_blank"
                                            icon={<FaYelp size="2em" />}
                                            alignSelf="flex-end"
                                            variant="outline"
                                            color={'rgba(224,7,7,1)'}
                                        />
                                    </Link>
                                </Box>
                            }
                        </Flex>
                        {
                            restaurant?.phone &&
                            <Box>
                                <Stack spacing={3} align='center' isInline>
                                    <PhoneIcon color={`${process.env.COLOR_THEME}.300`} />
                                    <a className='hover:underline' href={`tel:${restaurant?.phone}`}>{restaurant?.display_phone}</a>
                                </Stack>
                            </Box>
                        }
                        {
                            restaurant?.address &&
                            <Box>
                                <Stack spacing={3} align='center' isInline>
                                    <Icon as={IoLocationOutline} color={`${process.env.COLOR_THEME}.300`} />
                                    <Stack isInline>
                                        {restaurant?.address.map(val => {
                                            return (
                                                <Text fontSize='md' key={val}>{val}</Text>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </Box>
                        }
                        {
                            restaurant?.yelp_rating &&
                            <HStack>
                                <StarRating rating={restaurant.yelp_rating} />
                                <Text color={'gray.500'} fontSize={'sm'}>{restaurant.yelp_rating}</Text>
                                <Text color={'gray.500'} fontSize={'sm'}>({restaurant.review_count} reviews)</Text>
                            </HStack>
                        }
                    </VStack>
                </Box>
            </Flex>
        </Flex >
    )
}