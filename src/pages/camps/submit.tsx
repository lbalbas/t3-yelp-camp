import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import Layout from "~/components/layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { LoadingSpinner } from "~/components/loading";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

const SubmitCamp: NextPageWithLayout = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isLoading } = api.camps.create.useMutation({
    onError: () => {
      alert("Something went wrong, please try again later");
    },
    onSuccess: (camp) => {
      void router.push(`/camps/${camp.id}`);
    },
  });

  useEffect(() => {
    if (!isSignedIn) {
      alert("Please log in before trying to submit a campground.");
      void router.push("/camps");
    }
  }, [router, isSignedIn]);

const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    '^(http|https)://' + // protocol
    '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3})' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%_.~+]*)*' + // path
    '(\\.[a-z\\d%_.~+]{2,4})$', // image extension
    'i'
  ); // case-insensitive
  return urlPattern.test(urlString);
};

  const validateInputs = () => {
  	if(name.length === 0 || price.length < 2){
  		toast.error("Please type in proper values in every field.")
  		return false;
  	}

  	if(!isValidUrl(image)){
  		toast.error("Please introduce a valid absolute image url for the image field, it must start with http:// or https:// and end in an image file like .png")
  		return false;
  	}

  	if(description.length > 300 || description.length < 20){
  		toast.error("Please make sure your description is between 20 and 300 characters long.")
  		return false;
  	}

  	return true;
  };

  return (
    <div className="mx-auto flex w-5/6 flex-col gap-4 lg:w-3/6">
      <h1 className="py-2 text-2xl font-bold">Add New Campground</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="Name" className="text-sm font-bold text-slate-600">
          Campground Name
        </label>
        <input
          type="text"
          id="Name"
          className="rounded-md bg-stone-100 p-2 text-slate-600"
          placeholder="Seven Sisters Waterfall."
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="price" className="text-sm font-bold text-slate-600">
          Price
        </label>
        <input
          type="text"
          id="price"
          className="rounded-md bg-stone-100 p-2 text-slate-600"
          placeholder="$149"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          value={price}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="text-sm font-bold text-slate-600">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          className="rounded-md bg-stone-100 p-2 text-slate-600"
          placeholder="https://www.thepinoytraveler.com/2018/01/mt-ulap-diy-dayhike.html"
          onChange={(e) => {
            setImage(e.target.value);
          }}
          value={image}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-sm font-bold text-slate-600"
        >
          Description
        </label>
        <textarea
          id="description"
          className="h-56 rounded-md bg-stone-100 p-4 text-slate-600"
          placeholder="This was probably the best camp I've visited this past year, definitely recommend visiting any time soon."
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        onClick={() => {
        	if(validateInputs())
          		mutate({ name, image, price, description });
        }}
        className="flex w-full items-center justify-center rounded-md bg-black p-4 text-white"
      >
        {isLoading ? <LoadingSpinner size={24} /> : "Submit Camp"}
      </button>
    </div>
  );
};

SubmitCamp.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SubmitCamp;
