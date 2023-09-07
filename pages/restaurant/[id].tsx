import { ReviewType, SerializedRestaurantType } from 'models/restaurant'
import { GetServerSidePropsContext } from 'next';
import { PopulatedUserType } from 'models/user';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getRestaurant } from '../../utils/queries';
import { useQuery } from 'react-query';
import ErrorPage from '@components/ErrorPage';
import AppLayout from '@components/AppLayout';
import RestaurantDetails from '@components/RestaurantDetails';
import { NextSeo } from 'next-seo';
import ReviewModal from '@components/ReviewModal';
import ReviewSection from '@components/ReviewSection/ReviewSection';

interface RestaurantPageProps {
    restaurant: SerializedRestaurantType<ReviewType<PopulatedUserType>[]>;
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
        },
    );


    if ((typeof window !== 'undefined' && loading) || !session) return null;
    if (!id) return <ErrorPage statusCode={404} message="No restaurant selected" />;
    if (!data) {
        if (isLoading) {
            return <div>Loading</div>;
        }
        return (
            <ErrorPage statusCode={404} message="No restaurant found with provided ID" />
        );
    }


    const user = session.user;
    if (error) {
        return <p>There was an error</p>;
    }

    return (
        <AppLayout user={user} showMovies>
            <NextSeo title={data.name} />
            <RestaurantDetails restaurant={data} user={user} />
            <ReviewSection restaurant={data} />
            <ReviewModal user={session?.user} showReviewButton={false} />
        </AppLayout>
    )
}

interface SSRProps {
    props?: {
        session: Session | null;
        restaurant: SerializedRestaurantType<ReviewType<PopulatedUserType>[]> | null;
    };
    redirect?: {
        destination: string;
        permanent: boolean;
    };
}

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<SSRProps> {
    const { id } = ctx.query;
    if (!id) {
        return {
            props: { session: null, restaurant: null },
        };
    }
    const session = await getSession({ req: ctx.req });
    if (!session) {
        return {
            redirect: {
                destination: `/?restaurant=${id}`,
                permanent: false,
            },
        };
    }

    if (session?.user?.isBanned) {
        return {
            redirect: {
                destination: `/`,
                permanent: false,
            },
        };

    }

    const restaurant = await getRestaurant(id, true);

    return {
        props: {
            restaurant,
            session,
        },
    };
}
