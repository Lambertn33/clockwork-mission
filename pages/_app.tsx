import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient , QueryClientProvider } from "react-query";

import "../styles/globals.css";

const client = new QueryClient()
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={client}>
         <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
