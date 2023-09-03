import { ReviewType, SerializedRestaurantType } from 'models/restaurant'
import { PopulatedUserType } from 'models/user';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getRestaurant } from '../../utils/queries';
import { useQuery } from 'react-query';
import ErrorPage from '@components/ErrorPage';
import AppLayout from '@components/AppLayout';
import RestaurantDetails from '@components/RestaurantDetails';
import { NextSeo } from 'next-seo';

interface RestaurantPageProps {
    movie: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>;
    error?: string;
}

export default function RestaurantPage({ error, ...props }: RestaurantPageProps): any {
    const [session, loading] = useSession();
    const router = useRouter();
    const { id } = router.query;

    const { data, isLoading } = useQuery(
        `restaurant-${id}`,
        async () => {
            return await getRestaurant(id, true);
        }
    );


    if ((typeof window !== 'undefined' && loading) || !session) return null;
    if (!id) return <ErrorPage statusCode={404} message="No restaurant selected" />;
    if (!data) {
        if (isLoading) {
            return <div>Loading</div>;
        }
        return (
            <ErrorPage statusCode={404} message="No movie found with provided ID" />
        );
    }


    const user = session.user;
    if (error) {
      return <p>There was an error</p>;
    }

    return (
        <AppLayout user={user} showMovies>
            <NextSeo title={data.name} />
            <RestaurantDetails restaurant={data} user={user}/>
        </AppLayout>
    )
}