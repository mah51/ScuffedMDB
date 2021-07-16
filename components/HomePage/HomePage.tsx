import { useEffect } from 'react';
import { useColorMode, useToast } from '@chakra-ui/react';
import AppLayout from '../AppLayout';
import CardGrid from '../CardGrid';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { UserAuthType } from 'next-auth';
import { NextSeo } from 'next-seo';
import { PopulatedUserType } from '../../models/user';

interface HomePageProps {
  user: UserAuthType;
  movies: { data: SerializedMovieType<ReviewType<PopulatedUserType>[]>[] };
  movieID: string | string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  movies,
  movieID,
}): React.ReactElement => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NextSeo title="Home" />

      <AppLayout user={user} showMovies>
        <div>
          <CardGrid movies={movies} user={user} movieID={movieID} />
        </div>
      </AppLayout>
    </>
  );
};
