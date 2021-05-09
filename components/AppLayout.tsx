import React from 'react';
import { DiscordUser } from '../types/generalTypes';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { UserType } from '../models/user';

interface AppLayoutProps {
  user: UserType;
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
