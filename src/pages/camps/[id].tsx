import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps } from "next";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";
import LoadingBlock from '~/components/loading'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CampPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
	const {data} = api.camps.getOne.useQuery({id})

	if(!data) return <div> 404 - Not found</div>

	return(
		<div className="flex flex-col gap-10">
			<div className="w-4/6 mx-auto border border-slate-300 p-8 gap-3 rounded-md flex flex-col">
				<Image
					className="rounded-md"
					src={data.campground.image}
					alt={`Photo of ${data.campground.name}`}
					width={1080}
					height={675}
				/>
				<div className="flex w-full font-bold justify-between">
					<h1 className="text-xl">{data.campground.name}</h1>
					<span className="text-sm">{data.campground.price}</span>
				</div>
				<p className="text-slate-600">{data.campground.description}</p>
				<span className="text-slate-600 italic">{`Submitted by ${data.author.username}`}</span>
			</div>
			<Reviews campId={id}/>
		</div>
		)
}

const Reviews = (props: {campId: string}) => {
	const {campId} = props;
	const { isSignedIn, user } = useUser();
	const {data, isLoading} = api.reviews.getReviews.useQuery({campId})

	if(isLoading) return <LoadingBlock size={32} />

	return (
		<div className="mx-auto flex flex-col gap-4 items-end p-8 w-4/6 border-slate-300 border rounded-md">
			{(!data || data.length == 0) ? 
				(<p className="text-center w-full">No reviews of this camp yet, be the first!</p>)
				:
				data.map(review=>{
					return (
						<div className="flex w-full flex-col gap-2 pb-2 border-b border-slate-300">
							<div className="w-full flex justify-between">
								<h3 className="font-bold text-lg">{review.author.username}</h3>
								<span className="text-slate-600">{`${dayjs().to(
            dayjs(review.review.publishedAt)
          )}`}</span>
							</div>
							<p>{review.review.text}</p>
						</div>
						)
				})
			}
			{isSignedIn && (
				<Link className="p-4 flex items-center gap-2 rounded-md text-white bg-black" href={`/camps/leaveReview/${campId}`}>
					<Image src="/Chat Bubble.svg" alt="Chat Bubble" height={24} width={24}/>
					<span>Leave a Review</span>
				</Link>)}
		</div>
		)
}

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