import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getSession, Provider as NextAuthProvider } from 'next-auth/client';
import PlausibleProvider from 'next-plausible';
import { DefaultSeo } from 'next-seo';
import { ReviewModalContext } from '../utils/ModalContext';
import React, { useState, useEffect } from 'react';
import theme from '../styles/theme';
import { ReviewType, SerializedMovieType } from '../models/movie';
import { PopulatedUserType } from '../models/user';
import Router, { useRouter } from 'next/router';
import nProgress from 'nprogress';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { SerializedRestaurantType } from 'models/restaurant';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): React.ReactChild {
  useEffect(() => {
    nProgress.configure({ showSpinner: false });
    Router.events.on('routeChangeStart', () => nProgress.start());
    Router.events.on('routeChangeComplete', () => nProgress.done());
    Router.events.on('routeChangeError', () => nProgress.done());

    return () => {
      Router.events.off('routeChangeStart', () => nProgress.start());
      Router.events.off('routeChangeComplete', () => nProgress.done());
      Router.events.off('routeChangeError', () => nProgress.done());
    };
  }, []);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [movie, setMovie] = useState<SerializedMovieType<
    ReviewType<PopulatedUserType>[]
  > | null>(null);
  const [restaurant, setRestaurant] = useState<SerializedRestaurantType<
  ReviewType<PopulatedUserType>[]
> | null>(null);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const shortSiteName =
    process.env.NEXT_PUBLIC_SHORT_SITE_NAME ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    'SMDB';

  const router = useRouter();
  useEffect(() => {
    if (document.getElementById('__next')) {
      (document.getElementById('__next') as HTMLElement).scrollTop = 0;
    }
  }, [router.pathname]);
  const siteURI =
    process.env.NEXT_PUBLIC_APP_URI || 'https://www.movie.mikeroph.one';
  return (
    <>
      <DefaultSeo
        titleTemplate={`%s | ${shortSiteName}`}
        description={'A private movie rating website'}
        openGraph={{
          title: siteName,
          type: `website`,
          site_name: siteName,
          images: [
            {
              url: `${siteURI}/sitePicture.png`,
              alt: `Screenshot of ${siteName}`,
            },
          ],
        }}
      />
      <PlausibleProvider
        domain="movie.mikeroph.one"
        selfHosted
        trackOutboundLinks
        enabled={process.env.NODE_ENV === 'production'}
        customDomain={'https://stats.mikeroph.one'}
      >
        <NextAuthProvider
          session={pageProps.session}
          options={{
            clientMaxAge: 60, // Re-fetch session if cache is older than 60 seconds
            keepAlive: 5 * 60, // Send keepAlive message every 5 minutes
          }}
        >
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <ReviewModalContext.Provider
                value={{ isOpen, onOpen, onClose, movie, setMovie, restaurant, setRestaurant }}
              >
                <Component {...pageProps} />
              </ReviewModalContext.Provider>
            </ChakraProvider>
          </QueryClientProvider>
        </NextAuthProvider>
      </PlausibleProvider>
    </>
  );
}

export default MyApp;

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<{ props: { session: Session | null } }> {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
}
