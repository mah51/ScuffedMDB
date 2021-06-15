import React from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import { UserType } from '../../models/user';

interface AppLayoutProps {
  user: UserType;
  children: any;
  showMovies?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  showMovies,
  user,
  children,
}): React.ReactElement => (
  <>
    <Nav user={user} showMovies={showMovies} />
    {children}
    <Footer />
  </>
);
