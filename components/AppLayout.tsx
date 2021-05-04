import React from 'react';
import { DiscordUser } from '../types/generalTypes';
import { Nav } from './Nav';
import { Footer } from './Footer';

interface AppLayoutProps {
  user: DiscordUser;
  children: any;
  showMovies?: boolean;
}

export const AppLayout = ({ showMovies, user, children }: AppLayoutProps) => (
  <>
    <Nav user={user} showMovies={showMovies} />
    {children}
    <Footer />
  </>
);
