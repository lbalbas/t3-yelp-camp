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

dayjs.extend(relativeTime);

const CampPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
  const { data } = api.camps.getOne.useQuery({ id });

  if (!data) return <div> 404 - Not found</div>;

  return (
    <div className="flex flex-col gap-10">
      <div className="mx-auto flex w-4/6 flex-col gap-3 rounded-md border border-slate-300 p-8">
        <Image
          className="rounded-md"
          src={data.campground.image}
          alt={`Photo of ${data.campground.name}`}
          width={1080}
          height={675}
        />
        <div className="flex w-full justify-between font-bold">
          <h1 className="text-xl">{data.campground.name}</h1>
          <span className="text-sm">{data.campground.price}</span>
        </div>
        <p className="text-slate-600">{data.campground.description}</p>
        <span className="italic text-slate-600">{`Submitted by ${data.author.username}`}</span>
      </div>
      <Reviews campId={id} />
    </div>
  );
};

const Reviews = (props: { campId: string }) => {
  const { campId } = props;
  const { isSignedIn } = useUser();
  const { data, isLoading } = api.reviews.getReviews.useQuery({ campId });

  if (isLoading) return <LoadingBlock size={32} />;

  return (
    <div className="mx-auto flex w-4/6 flex-col items-end gap-4 rounded-md border border-slate-300 p-8">
      {!data || data.length == 0 ? (
        <p className="w-full text-center">
          No reviews of this camp yet, be the first!
        </p>
      ) : (
        data.map((review) => {
          return (
            <div key={review.review.id}className="flex w-full flex-col gap-2 border-b border-slate-300 pb-4">
              <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{review.author.username}</h3>
                <span className="flex items-center">{Array.from({ length: review.review.rating }).map((index)=> <Image key={index} alt="Star" src="/star.svg" height={16} width={16}/>)}</span>
              </div>
                <span className="text-slate-600 text-sm">{`${dayjs().to(
                  dayjs(review.review.publishedAt)
                )}`}</span>
              </div>
              <p className="text-slate-600">{review.review.text}</p>
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
