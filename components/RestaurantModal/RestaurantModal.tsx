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
} from '@chakra-ui/react';


export const RestaurantModal: React.FC<{
    isRestaurantOpen: any,
    onRestaurantClose: any
}> = ({
    isRestaurantOpen,
    onRestaurantClose
}): React.ReactElement => {
        const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log(`submit: ${name} ${address} ${city} ${state} ${country}`)
        };

        const [name, setName] = useState('');
        const [address, setAddress] = useState('');
        const [city, setCity] = useState('');
        const [state, setState] = useState('');
        const [country, setCountry] = useState('');



        return (
            <>
                <Modal isOpen={isRestaurantOpen} onClose={onRestaurantClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add a restaurant</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleSubmit}>
                            <FormControl className='px-3 py-3' isRequired>
                                <VStack align='flex-start'>
                                    <FormLabel display={'flex'}>Name</FormLabel>
                                    <Input placeholder='Example Name' onChange={e => setName(e.currentTarget.value)}/>
                                </VStack>
                                <VStack align='flex-start'>
                                    <FormLabel display={'flex'}>Address</FormLabel>
                                    <Input placeholder='123 Main St' onChange={e => setAddress(e.currentTarget.value)}/>
                                </VStack>
                                <VStack align='flex-start'>
                                    <FormLabel display={'flex'}>City</FormLabel>
                                    <Input placeholder='Gotham' onChange={e => setCity(e.currentTarget.value)}/>
                                </VStack>
                                <VStack align='flex-start'>
                                    <FormLabel display={'flex'}>State</FormLabel>
                                    <Input placeholder='MI' onChange={e => setState(e.currentTarget.value)}/>
                                </VStack>
                                <VStack align='flex-start'>
                                    <FormLabel display={'flex'}>Country</FormLabel>
                                    <Input placeholder='US' onChange={e => setCountry(e.currentTarget.value)}/>
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
                    </ModalContent>
                </Modal>
            </>
        )
    }
