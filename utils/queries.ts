import { config } from './config';

export const getMovies = async () => {
  const res: Response = await fetch(`${config.appUri}/api/movie`);
  // eslint-disable-next-line no-return-await
  return await res.json();
};

export const getUsers = async () => {
  const res: Response = await fetch(`${config.appUri}/api/users`);
  const data = await res.json();
  return data.users;
};
