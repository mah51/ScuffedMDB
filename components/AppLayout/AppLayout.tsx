import React, { ReactNode } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import { UserAuthType } from 'next-auth';
import { Flex } from '@chakra-ui/react';

interface AppLayoutProps {
  user: UserAuthType;
  children: ReactNode;
  showMovies?: boolean;
  showReview?: boolean;
}

export const AppLayout = ({
  showMovies,
  showReview,
  user,
  children,
}: AppLayoutProps): React.ReactElement => (
  <Flex minHeight="calc(100vh + 115px)" direction="column">
    <Nav
      user={user}
      showMovies={showMovies || false}
      showReview={showReview || false}
    />
    {children}
    <Footer />
  </Flex>
);
