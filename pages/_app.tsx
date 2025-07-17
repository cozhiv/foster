import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import StoreProvider from '@/app/StoreProvider';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider>
      <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;