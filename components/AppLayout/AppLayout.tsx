import React from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import { UserAuthType } from '../../types/next-auth';

interface AppLayoutProps {
  user: UserAuthType;
  children: any;
  showMovies?: boolean;
  showReview?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  showMovies,
  showReview,
  user,
  children,
}): React.ReactElement => (
  <>
    <Nav user={user} showMovies={showMovies} showReview={showReview} />
    {children}
    <Footer />
  </>
);
