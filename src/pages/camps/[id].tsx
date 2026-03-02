import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps } from "next";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import LoadingBlock from "~/components/loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const Map = dynamic(() => import("~/components/Map"), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading map...</p>
});

dayjs.extend(relativeTime);

const CampPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
  const { data } = api.camps.getOne.useQuery({ id });

  if (!data) return <div> 404 - Not found</div>;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start p-4">
      <Head>
        <title>{data.campground.name} | YelpCamp</title>
      </Head> 

      {/* Left Column: Map */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 order-2 md:order-1">
        {data.campground.lat && data.campground.lng && (
          <div className="w-full h-80 md:h-[400px] rounded-md overflow-hidden relative z-0 border border-slate-300">
              <Map lat={data.campground.lat} lng={data.campground.lng} popupText={data.campground.name} />
          </div>
        )}
      </div>

      {/* Right Column: Campground Details & Reviews */}
      <div className="flex w-full md:w-2/3 flex-col gap-10 order-1 md:order-2">
        <div className="flex flex-col gap-3 rounded-md border border-slate-300 p-8">
          <Image
            className="rounded-md w-full h-auto object-cover"
            src={data.campground.image}
            alt={`Photo of ${data.campground.name}`}
            width={1080}
            height={675}
          />
          <div className="flex w-full justify-between font-bold mt-2">
            <div className="flex flex-col">
              <h1 className="text-xl">{data.campground.name}</h1>
              {data.campground.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.round(data.campground.averageRating) }).map((_, i) => (
                    <Image key={i} alt="Star" src="/star.svg" height={16} width={16} />
                  ))}
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    ({data.campground.averageRating.toFixed(1)})
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm">{data.campground.price}</span>
          </div>
          <p className="text-slate-600">{data.campground.description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="italic text-sm text-slate-500">{`Submitted by ${data.author.username}`}</span>
            {useUser().user?.id === data.campground.creatorId && (
              <div className="flex gap-2">
                <Link
                  href={`/camps/edit/${id}`}
                  className="rounded-md bg-yellow-500 px-3 py-1 text-xs text-white"
                >
                  Edit
                </Link>
                <DeleteCampButton id={id} />
              </div>
            )}
          </div>
        </div>
        <Reviews campId={id} />
      </div>

    </div>
  );
};

const DeleteCampButton = (props: { id: string }) => {
  const router = useRouter();
  const { mutate, isLoading } = api.camps.delete.useMutation({
    onSuccess: () => {
      toast.success("Campground deleted successfully");
      void router.push("/camps");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        if (confirm("Are you sure you want to delete this campground?")) {
          mutate({ id: props.id });
        }
      }}
      className="rounded-md bg-red-500 px-3 py-1 text-xs text-white"
    >
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
};

const Reviews = (props: { campId: string }) => {
  const { campId } = props;
  const { isSignedIn, user } = useUser();
  const utils = api.useContext();
  const { data, isLoading } = api.reviews.getReviews.useQuery({ campId });

  const { mutate: deleteReview, isLoading: isDeletingReview } = api.reviews.deleteReview.useMutation({
    onSuccess: () => {
      toast.success("Review deleted");
      void utils.reviews.getReviews.invalidate({ campId });
      void utils.camps.getOne.invalidate({ id: campId });
    },
  });

  if (isLoading) return <LoadingBlock size={32} />;

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border border-slate-300 p-8">
      {!data || data.length == 0 ? (
        <p className="w-full text-center">
          No reviews of this camp yet, be the first!
        </p>
      ) : (
        data.map((review) => {
          return (
            <div
              key={review.review.id}
              className="flex w-full flex-col gap-2 border-b border-slate-300 pb-4"
            >
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">
                    {review.author.username}
                  </h3>
                  <span className="flex items-center">
                    {Array.from({ length: review.review.rating }).map(
                      (x, index) => (
                        <Image
                          key={index}
                          alt="Star"
                          src="/star.svg"
                          height={16}
                          width={16}
                        />
                      )
                    )}
                  </span>
                </div>
                <span className="text-sm text-slate-600">{`${dayjs().to(
                  dayjs(review.review.publishedAt)
                )}`}</span>
              </div>
              <p className="text-slate-600">{review.review.text}</p>
              {user?.id === review.review.creatorId && (
                <div className="mt-2 flex gap-2 self-end">
                  <button
                    disabled={isDeletingReview}
                    onClick={() => {
                      if (confirm("Delete this review?")) {
                        deleteReview({ id: review.review.id });
                      }
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete Review
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
      {isSignedIn && (
        <Link
          className="flex items-center gap-2 rounded-md bg-black p-4 text-white"
          href={`/camps/leaveReview/${campId}`}
        >
          <Image
            src="/Chat Bubble.svg"
            alt="Chat Bubble"
            height={24}
            width={24}
          />
          <span>Leave a Review</span>
        </Link>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.camps.getOne.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

CampPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default CampPage;
