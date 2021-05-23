import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import PlausibleProvider from 'next-plausible';

const theme = extendTheme({
  colors: {
    brand: {
      300: `#84C9FB`,
    },
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider
      domain="movie.michael-hall.me"
      selfHosted
      trackOutboundLinks
      enabled={process.env.NODE_ENV === 'production'}
      customDomain={'https://stats.michael-hall.me'}
    >
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </PlausibleProvider>
  );
}

export default MyApp;
