import React, { FormEvent, useState } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
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
    Box
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { YelpMatchResponse } from "../../pages/api/restaurant-api";


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
                />
            </Skeleton>
        </AspectRatio>
    );
}

export const RestaurantModal: React.FC<{
    isRestaurantOpen: any,
    onRestaurantClose: any,
    setError: any
}> = ({
    isRestaurantOpen,
    onRestaurantClose,
    setError
}): React.ReactElement => {
        // Form states
        const [name, setName] = useState('');
        const [address, setAddress] = useState('');
        const [city, setCity] = useState('');
        const [state, setState] = useState('');
        const [country, setCountry] = useState('');

        const [restaurant, setRestaurant] = useState<YelpMatchResponse>(null);

        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log(`submit: ${name} ${address} ${city} ${state} ${country}`)
            try {
                const url = `${process.env.NEXT_PUBLIC_APP_URI}/api/restaurant-api?name=${name}&address=${address}&city=${city}&state=${state}&country=${country}`
                const response = await fetch(url);
                if (response.status === 200) {
                    const data: YelpMatchResponse = await response.json();
                    console.log(data)
                    setRestaurant(data);
                }
                else {
                    setError('Error searching for restaurant');
                }
            }
            catch (err) {
                console.error(err);
                if (err) {
                    setError(err.message);
                }
            }
        };


        return (
            <>
                <Modal isOpen={isRestaurantOpen} onClose={onRestaurantClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add a restaurant</ModalHeader>
                        <ModalCloseButton />
                        {restaurant ?
                            <VStack spacing={4} className="p-5" align="stretch">
                                <Flex>
                                    <SkeletonImage data={restaurant} />
                                </Flex>
                                <Heading>
                                    {restaurant?.name}
                                </Heading>
                                {
                                    restaurant.categories ?
                                        <HStack>
                                            <Text>Categories: {restaurant?.categories.map(x => x.title).join(', ')}</Text>
                                        </HStack> : ''
                                }
                                <Box display='flex' mt='2' alignItems='center'>
                                    {Array(5)
                                        .fill('')
                                        .map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                color={i < restaurant?.rating ? 'yellow.500' : 'gray.300'}
                                            />
                                        ))}
                                    <Box as='span' ml='2' color='gray.600' fontSize='sm'>
                                        {restaurant?.review_count} reviews
                                    </Box>
                                </Box>
                            </VStack> :
                            <form onSubmit={handleSubmit}>
                                <FormControl className='px-3 py-3' isRequired>
                                    <VStack align='flex-start'>
                                        <FormLabel display={'flex'}>Name</FormLabel>
                                        <Input placeholder='Example Name' onChange={e => setName(e.currentTarget.value)} />
                                    </VStack>
                                    <VStack align='flex-start'>
                                        <FormLabel display={'flex'}>Address</FormLabel>
                                        <Input placeholder='123 Main St' onChange={e => setAddress(e.currentTarget.value)} />
                                    </VStack>
                                    <VStack align='flex-start'>
                                        <FormLabel display={'flex'}>City</FormLabel>
                                        <Input placeholder='Gotham' onChange={e => setCity(e.currentTarget.value)} />
                                    </VStack>
                                    <VStack align='flex-start'>
                                        <FormLabel display={'flex'}>State</FormLabel>
                                        <Input placeholder='MI' onChange={e => setState(e.currentTarget.value)} />
                                    </VStack>
                                    <VStack align='flex-start'>
                                        <FormLabel display={'flex'}>Country</FormLabel>
                                        <Input placeholder='US' onChange={e => setCountry(e.currentTarget.value)} />
                                    </VStack>
                                    <Flex align='flex-start'>
                                        <Button
                                            type="submit"
                                            className="mt-2"
                                            colorScheme={process.env.COLOR_THEME}
                                        >
                                            Search
                                        </Button>
                                    </Flex>
                                </FormControl>
                            </form>
                        }
                    </ModalContent>
                </Modal>
            </>
        )
    }
