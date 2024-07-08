import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTokenCookie } from '../utils/auth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token = getTokenCookie();
    if (token && (router.pathname === '/' || router.pathname === '/login')) {
      router.push('/dashboard');
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;