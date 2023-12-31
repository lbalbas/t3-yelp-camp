import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps } from "next";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "../../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import Image from "next/image";
import Link from "next/link";
import Head from 'next/head';

const SearchPage: NextPageWithLayout<{ query: string }> = ({ query }) => {
  const { data } = api.camps.search.useQuery({ query });

  return (
    <div className="flex flex-col">
      <Head>
        <title>{`Searching for ${query} | YelpCamp`}</title> 
      </Head>
      <h1 className="py-4 text-2xl font-bold">{`Searching for ${query}`}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!data || data.length == 0 ? (
          <div>{`Didn't find anything.`}</div>
        ) : (
          data.map((camp) => {
            return (
              <div
                key={camp.id}
                className="flex flex-col gap-2 rounded-md border border-slate-300 p-3"
              >
                <Image
                  className="rounded-md"
                  src={camp.image}
                  width={385}
                  height={200}
                  alt={`Photo of ${camp.name}`}
                />
                <h2 className="font-bold">{camp.name}</h2>
                <p className="text-slate-600">{camp.description}</p>
                <Link
                  className="w-full rounded-md border border-slate-300 py-2 text-center font-bold"
                  href={`/camps/${camp.id}`}
                >
                  View Campground
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const query = context.params?.query;

  if (typeof query !== "string") throw new Error("no query");

  await ssg.camps.search.prefetch({ query });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SearchPage;
