import { DiscordUser } from '../types/generalTypes';
import { AppLayout } from './AppLayout';
import { CardGrid } from './CardGrid';
import { MovieType } from '../models/movie';

interface HomePageProps {
  user: DiscordUser;
  movies: MovieType[];
}

export const HomePage = ({ user, movies }: HomePageProps) => (
  <AppLayout user={user} showMovies>
    <div>
      <CardGrid movies={movies} />
    </div>
  </AppLayout>
);
