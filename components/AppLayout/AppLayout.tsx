import React, { ReactNode } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import { UserAuthType } from 'next-auth';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import NextNProgress from 'nextjs-progressbar';
import theme from 'styles/theme';

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
    <NextNProgress
      options={{ showSpinner: false }}
      color={
        //@ts-ignore
        theme.colors[process.env.COLOR_THEME][useColorModeValue('500', '300')]
      }
    />
    <Nav
      user={user}
      showMovies={showMovies || false}
      showReview={showReview || false}
    />
    {children}
    <Footer />
  </Flex>
);
