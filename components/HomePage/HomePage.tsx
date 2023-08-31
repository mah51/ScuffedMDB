import AppLayout from '../AppLayout';
import CardGrid from '../CardGrid';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { SerializedRestaurantType } from '../../models/restaurant';
import { UserAuthType } from 'next-auth';
import { NextSeo } from 'next-seo';
import { PopulatedUserType } from '../../models/user';
import AlertBanner from '../AlertBanner';

interface HomePageProps {
  user: UserAuthType;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  restaurants?: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>[];
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  movies,
  restaurants
}): React.ReactElement => {
  return (
    <>
      <NextSeo title="Home" />

      {!user.isAdmin && !user.isReviewer && (
        <AlertBanner
          storageName="dismissReadOnlyAlert"
          color="red"
          title="App is in read only mode!"
          message="You need reviewer permissions to add content."
        />
      )}

      {user.isReviewer && (
        <AlertBanner
          color="green"
          storageName="dismissReviewPromotion"
          title="You have been promoted to reviewer!"
          message="You can now add and remove reviews from movies"
        />
      )}

      <AppLayout user={user} showMovies>
        <div>
          <CardGrid movies={movies} user={user} restaurants={restaurants} />
        </div>
      </AppLayout>
    </>
  );
};
