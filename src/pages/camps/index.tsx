import { api } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import LoadingBlock from "~/components/loading";

const Camps: NextPageWithLayout = () => {
  const { data, isLoading } = api.camps.getFeatured.useQuery();

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-2 rounded-md bg-stone-50 p-10">
        <h1 className="text-3xl font-bold">Welcome to YelpCamp!</h1>
        <p className="text-slate-600">
          View hand-picked campgrounds from all over the world, or add your own.
        </p>
        <div className="flex gap-2">
          <div className="relative flex items-center">
            <Image
              className="absolute left-4"
              src="/Search Icon.svg"
              alt="Search Icon"
              height={18}
              width={18}
            />
            <input
              className="rounded-md border border-slate-300 px-4 py-3 pl-10"
              placeholder="Search for camps"
              type="text"
            />
          </div>
          <button className="rounded-md bg-black px-4 py-3 text-white">
            Search
          </button>
        </div>
        <Link className="text-slate-600 underline" href="/camps/create">
          Or add your own campground
        </Link>
      </div>
      {isLoading && <LoadingBlock size={32} />}
      {!!data && (
        <div className="grid grid-cols-3 grid-rows-2 gap-6">
          {data.map((camp) => {
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
          })}
        </div>
      )}
    </div>
  );
};

Camps.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Camps;
