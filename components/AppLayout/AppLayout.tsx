import React, { ReactNode } from 'react';
import Nav from '../Nav';
import Footer from '../Footer';
import { UserAuthType } from 'next-auth';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import theme from 'styles/theme';
import { css, Global } from '@emotion/react';

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
    <Global
      styles={css`
        #nprogress {
          pointer-events: none;
          width: 100%;
        }
        #nprogress .bar {
          background-color: ${
            /* @ts-ignore */
            theme.colors[process.env.COLOR_THEME][
              useColorModeValue('500', '300')
            ]
          };
          position: fixed;
          z-index: 9999;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
        }

        .nprogress-custom-parent #nprogress .spinner,
        .nprogress-custom-parent #nprogress .bar {
          position: absolute;
        }
        @-webkit-keyframes nprogress-spinner {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }
        @keyframes nprogress-spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}
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
