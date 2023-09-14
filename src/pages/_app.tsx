import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Archivo } from "next/font/google";
import { Toaster } from "react-hot-toast";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <ClerkProvider {...pageProps}>
      <Toaster
        position={"top-center"}
        toastOptions={{
          duration: 5000,
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        }}
      />
      <Head>
        <title>Yelp Camp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${archivo.variable} font-archivo`}>{layout}</div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
