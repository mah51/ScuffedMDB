import { DiscordUser } from '../types/generalTypes';
import { AppLayout } from './AppLayout';
import { CardGrid } from './CardGrid';

interface HomePageProps {
  user: DiscordUser;
  movies: [];
}

export const HomePage = (props) => (
  <AppLayout user={props.user}>
    <div>
      <CardGrid movies={props.movies} />
    </div>
  </AppLayout>
);
