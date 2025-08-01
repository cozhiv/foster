import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import StoreProvider from '@/app/StoreProvider';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider count={1}>
      <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;