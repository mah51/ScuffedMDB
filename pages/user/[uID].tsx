import React from "react";
import { Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import { UserType } from "../../models/user";
import { parseUser } from "../../utils/parseDiscordUser";
import { AppLayout } from "../../components/AppLayout";
import AboutUserSection from "../../components/AboutUserSection";
import User from "../../models/user";
import { getMovies } from "../../utils/queries";
import { MovieType, ReviewType } from "../../models/movie";
import UserReviewSection from "../../components/UserReviewSection";

interface EditUserProps {
    user: UserType;
    desiredUser: UserType;
    movies: MovieType[];
}

function EditUser({ user, desiredUser, movies }: EditUserProps) {
    if (!user) {
        return null;
    }
    console.log(movies);
    const allRatings = movies
        .map((movie: any) => {
            const rev = movie.reviews.find(
                (review: any) => review.user.id === user.id
            );
            rev.movie = {
                name: movie.name,
                image: movie.image,
            };
            return rev;
        })
        .filter((x) => (x ? true : false));
    console.log(allRatings);
    return (
        <AppLayout user={user}>
            <Flex direction="column" pt={16} maxW="6xl" mx="auto">
                <AboutUserSection user={desiredUser} reviews={allRatings} />
                <Divider mt={10} />
                <UserReviewSection reviews={allRatings} />
                {/* <UserStatsSection /> */}
            </Flex>
        </AppLayout>
    );
}

export async function getServerSideProps(ctx) {
    const { uID } = ctx.query;
    const user: UserType = await parseUser(ctx);
    let desiredUser: any;
    if (user) {
        desiredUser = await User.findById(uID).lean();
        desiredUser._id = desiredUser._id.toString();
        desiredUser.createdAt = desiredUser.createdAt.getTime();
        desiredUser.updatedAt = desiredUser.updatedAt.getTime();
    }
    const movies = await getMovies();

    return {
        props: {
            user,
            desiredUser: desiredUser || null,
            movies: movies,
        },
    };
}

export default EditUser;
