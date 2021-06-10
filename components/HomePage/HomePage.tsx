import { useEffect } from 'react';
import { useColorMode, useToast } from '@chakra-ui/react';
import AppLayout from '../AppLayout';
import CardGrid from '../CardGrid';
import { MovieType } from '../../models/movie';
import { UserType } from '../../models/user';

interface HomePageProps {
    user: UserType;
    movies: MovieType[];
}

export const HomePage = ({ user, movies }: HomePageProps) => {
    const { colorMode } = useColorMode();
    const toast = useToast();
    // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
    useEffect(() => {
        toast.update(`test`, {
            variant: `subtle`,
            position: `top`,
            title: `Read only mode`,
            description: `You do not have permissions to add or remove reviews.`,
            status: `error`,
            isClosable: true,
        });
    }, [colorMode]);
    useEffect(() => {
        if (!user.isAdmin && !user.isReviewer) {
            toast({
                id: `test`,
                variant: `subtle`,
                position: `top`,
                title: `Read only mode`,
                description: `You do not have permissions to add or remove reviews.`,
                status: `error`,
                isClosable: true,
            });
        }
    }, []);
    return (
        <AppLayout user={user} showMovies>
            <div>
                <CardGrid movies={movies} user={user} />
            </div>
        </AppLayout>
    );
};
