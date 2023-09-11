import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps } from "next";
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import Image from 'next/image';

const CampPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
	const {data} = api.camps.getOne.useQuery({id})
	
	if(!data) return <div> 404 - Not found</div>

	return(
		<div className="flex flex-col gap-10">
			<div className="w-4/6 mx-auto border border-slate-300 p-8 gap-3 rounded-md flex flex-col">
				<Image
					className="rounded-md"
					src={data.image}
					alt={`Photo of ${data.name}`}
					width={1080}
					height={675}
				/>
				<div className="flex w-full font-bold justify-between">
					<h1 className="text-xl">{data.name}</h1>
					<span className="text-sm">{data.price}</span>
				</div>
				<p className="text-slate-600">{data.description}</p>
				<span className="text-slate-600 italic">{`Submitted by ${data.creatorId}`}</span>
			</div>
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