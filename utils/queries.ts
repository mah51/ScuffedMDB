export const getMovies = async () => {
    const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`,
    );
    // eslint-disable-next-line no-return-await
    const movies = await res.json();
    return movies.data.sort((a, b) => a.createdAt - b.createdAt).reverse();
};

export const getUsers = async () => {
    const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/users`,
    );
    const data = await res.json();
    return data.users;
};
