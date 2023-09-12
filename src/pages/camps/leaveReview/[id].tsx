import { useRouter } from 'next/router';
import { api } from "~/utils/api";
import type { NextPageWithLayout } from "../../_app";
import type { ReactElement } from "react";
import Layout from "~/components/layout";
import {useState, useMemo} from 'react'
import Image from 'next/image';
import {LoadingSpinner} from '~/components/loading';
import type { GetStaticProps } from "next";

const LeaveReview: NextPageWithLayout<{ id: string }> = ({id}) => {
    const router = useRouter();
    const {mutate, isLoading} = api.reviews.createReview.useMutation({
    onSuccess: ()=>{
      void router.push(`/camps/${id}`)
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage?.[0]) {
        alert(errorMessage[0]);
      } else {
        alert("Failed to post! Please try again later.");
      }
    },
  });
	const [rating, setRating] = useState(3);
	const [comment, setComment] = useState("");
	
	return(
		<div className="w-4/6 lg:w-3/6 flex flex-col gap-4 mx-auto">
			<h1 className="text-2xl font-bold py-2">Add New Review</h1>
			<RatingSelect rating={rating} setRating={setRating} />
			<div className="flex flex-col gap-2">
				<span className="text-sm font-bold text-slate-600">Description</span>
				<textarea className="h-56 p-4 bg-stone-50 text-slate-600 rounded-md" placeholder="This was probably the best camp I've visited this past year, definitely recommend visiting any time soon." onChange={(e)=>{setComment(e.target.value)}} value={comment}/>
			</div>
			<button disabled={isLoading} onClick={()=>{mutate({campgroundId:router.query.id, rating, text: comment})}} className="p-4 w-full flex items-center justify-center bg-black rounded-md text-white">{isLoading ? <LoadingSpinner size={24}/> : "Post Review"}</button>
		</div>
	)
}

type RatingSelectProps = {
  rating: number;
  setRating: (rating: number) => void;
};

const RatingSelect: React.FC<RatingSelectProps> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const onMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const onMouseLeave = () => {
    setHoverRating(0);
  };

  const onSaveRating = (index: number) => {
    setRating(index);
  };

  return (
  	<div>
  		<span className="text-sm font-bold text-slate-600">Rating</span>
	    <div className="flex gap-1">
	      {[1, 2, 3, 4, 5].map((index) => (
	        <Star
	          key={index}
	          index={index}
	          rating={rating}
	          hoverRating={hoverRating}
	          onMouseEnter={onMouseEnter}
	          onMouseLeave={onMouseLeave}
	          onSaveRating={onSaveRating}
	        />
	      ))}
	    </div>
    </div>
  );
};

type StarProps = {
  index: number;
  rating: number;
  hoverRating: number;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  onSaveRating: (index: number) => void;
};

const Star: React.FC<StarProps> = ({ index, rating, hoverRating, onMouseEnter, onMouseLeave, onSaveRating }) => {
  const fill = useMemo(() => {
    if (hoverRating >= index) {
      return "yellow";
    } else if (!hoverRating && rating >= index) {
      return "yellow";
    }
    return "none";
  }, [rating, hoverRating, index]);

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={() => onMouseLeave()}
      onClick={() => onSaveRating(index)}
    >
      <Image className="stroke-yellow-500" height={16} width={16} alt="Star" src={fill === "yellow" ? "/star.svg" : "/star-outline.svg"} />
    </div>
  );
};

LeaveReview.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No id");

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default LeaveReview;