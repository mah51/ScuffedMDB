export const getMovies = async () => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/movie`,
  );
  // eslint-disable-next-line no-return-await
  return await res.json();
};

export const getUsers = async () => {
  const res: Response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URI}/api/users`,
  );
  const data = await res.json();
  return data.users;
};
