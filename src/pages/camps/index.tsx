import { api } from "~/utils/api";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import LoadingBlock from "~/components/loading";
import { LoadingSpinner } from "~/components/loading";
import type { Campground } from "@prisma/client";
import Head from 'next/head';

const Camps: NextPageWithLayout = () => {
  const router = useRouter();
  const [searchQuery, setQuery] = useState("");
  const [isSearching, setSearchState] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "topRated">("newest");

  const { data: topRated, isLoading: isTopRatedLoading } =
    api.camps.getTopRated.useQuery();

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
  } = api.camps.list.useInfiniteQuery(
    { limit: 6, sort: sortOrder },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const allCamps = useMemo(() => {
    return infiniteData?.pages.flatMap((page) => page.items) ?? [];
  }, [infiniteData]);

  const redirectToSearch = () => {
    if (searchQuery.length === 0)
      return alert("Please type in the search bar first.");

    setSearchState(true);
    void router.push(`/camps/search/${searchQuery}`);
  };

  return (
    <div className="flex w-full flex-col gap-12 pb-12">
      <Head>
        <title>Search for a Camp | YelpCamp</title>
      </Head>

      {/* Hero Section */}
      <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100 p-8 shadow-sm md:p-12">
        <div className="max-w-2xl flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Discover Your Next Adventure
          </h1>
          <p className="text-lg text-slate-600">
            Explore the best campgrounds worldwide, hand-picked by our community.
            Find your perfect escape with YelpCamp.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <div className="relative flex min-w-[300px] items-center flex-1 max-w-md">
            <Image
              className="absolute left-4 opacity-50"
              src="/Search Icon.svg"
              alt="Search Icon"
              height={18}
              width={18}
            />
            <input
              className="w-full rounded-full border border-slate-300 px-4 py-4 pl-12 text-slate-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              placeholder="Search for your next destination..."
              type="text"
              value={searchQuery}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && redirectToSearch()}
            />
          </div>
          <button
            disabled={isSearching}
            onClick={redirectToSearch}
            className="rounded-full bg-black px-8 py-4 font-bold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isSearching ? <LoadingSpinner size={20} /> : "Search"}
          </button>
        </div>
        
        <Link className="text-sm font-medium text-slate-500 hover:text-black transition-colors underline underline-offset-4" href="/camps/submit">
          Or add your own campground
        </Link>
      </div>

      {/* Featured / Top Rated Section */}
      {!!topRated && topRated.length > 0 && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Top Rated Camps</h2>
            <div className="h-0.5 flex-1 mx-4 bg-slate-100 hidden sm:block" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {topRated.map((camp: Campground) => (
              <Link 
                href={`/camps/${camp.id}`} 
                key={`featured-${camp.id}`}
                className="group relative h-64 overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
              >
                <Image
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-110"
                  src={camp.image}
                  fill
                  alt={camp.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-1">
                     <Image alt="Star" src="/star.svg" height={16} width={16} />
                     <span className="text-sm font-bold text-white">{camp.averageRating.toFixed(1)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{camp.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Listing Section */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Explore Campground</h2>
          
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setSortOrder("newest")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                sortOrder === "newest" 
                ? "bg-white text-black shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder("topRated")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                sortOrder === "topRated" 
                ? "bg-white text-black shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Highest Rated
            </button>
          </div>
        </div>

        {(isListLoading && allCamps.length === 0) ? (
          <div className="py-20 text-center">
            <LoadingBlock size={48} />
            <p className="mt-4 text-slate-500">Loading campgrounds...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allCamps.map((camp: Campground) => (
                <div
                  key={camp.id}
                  className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden rounded-xl">
                    <Image
                      className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                      src={camp.image}
                      fill
                      alt={`Photo of ${camp.name}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{camp.name}</h3>
                      {camp.averageRating > 0 && (
                        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-600">
                          <Image alt="Star" src="/star.svg" height={14} width={14} />
                          <span className="text-xs font-bold leading-none">
                            {camp.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {camp.description}
                    </p>
                  </div>
                  <Link
                    className="mt-auto w-full rounded-xl bg-slate-50 py-3 text-center text-sm font-bold text-slate-900 transition-colors hover:bg-black hover:text-white"
                    href={`/camps/${camp.id}`}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => void fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="flex items-center gap-2 rounded-full border-2 border-slate-200 px-8 py-3 font-bold text-slate-600 transition-all hover:border-black hover:text-black disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <>
                      <LoadingSpinner size={20} />
                      Loading...
                    </>
                  ) : (
                    "Show More Camps"
                  )}
                </button>
              </div>
            )}
            
            {!hasNextPage && allCamps.length > 0 && (
              <p className="mt-12 text-center text-sm font-medium text-slate-400">
                You've reached the end of our list. More coming soon!
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

Camps.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Camps;
