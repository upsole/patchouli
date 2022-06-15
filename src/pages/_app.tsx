import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/globals.css";
import Layout from "../components/Layout";
import {useDarkMode} from "../lib/darkMode/useDarkMode";
import { __prod__ } from "../lib/constants";


const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [_, __] = useDarkMode();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {!__prod__ && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
