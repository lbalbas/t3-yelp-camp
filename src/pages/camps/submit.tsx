import {useRouter} from 'next/router';
import { api } from "~/utils/api";
import {useState, useEffect} from 'react'
import Layout from "~/components/layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import {LoadingSpinner} from "~/components/loading";
import { useUser } from "@clerk/nextjs";

const SubmitCamp: NextPageWithLayout = () => {
	const { isSignedIn } = useUser();
	const router = useRouter();
	const [name, setName] = useState("");
	const [image, setImage] = useState("");
	const [price, setPrice] = useState("")
	const [description, setDescription] = useState("");

	const {mutate, isLoading} = api.camps.create.useMutation({
		onError: ()=>{
			alert("Something went wrong, please try again later");
		},
		onSuccess: (camp)=>{
			void router.push(`/camps/${camp.id}`)
		}
	})
	
	useEffect(()=>{
		if(!isSignedIn){
			alert("Please log in before trying to submit a campground.")
			void router.push("/camps")
		}
	},[router, isSignedIn])

	return (
<div className="w-5/6 lg:w-3/6 flex flex-col gap-4 mx-auto">
			<h1 className="text-2xl font-bold py-2">Add New Campground</h1>
			<div className="flex flex-col gap-2">
				<label htmlFor="Name" className="text-sm font-bold text-slate-600">Campground Name</label>
				<input type="text" id="Name" className="p-2 bg-stone-100 text-slate-600 rounded-md" placeholder="Seven Sisters Waterfall." onChange={(e)=>{setName(e.target.value)}} value={name}/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="price" className="text-sm font-bold text-slate-600">Price</label>
				<input type="text" id="price" className="p-2 bg-stone-100 text-slate-600 rounded-md" placeholder="$149" onChange={(e)=>{setPrice(e.target.value)}} value={price}/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="image" className="text-sm font-bold text-slate-600">Image URL</label>
				<input type="text" id="image" className="p-2 bg-stone-100 text-slate-600 rounded-md" placeholder="www.thepinoytraveler.com/2018/01/mt-ulap-diy-dayhike.html" onChange={(e)=>{setImage(e.target.value)}} value={image}/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="description" className="text-sm font-bold text-slate-600">Description</label>
				<textarea id="description" className="h-56 p-4 bg-stone-100 text-slate-600 rounded-md" placeholder="This was probably the best camp I've visited this past year, definitely recommend visiting any time soon." onChange={(e)=>{setDescription(e.target.value)}} value={description}/>
			</div>
			<button type="submit" disabled={isLoading} onClick={()=>{
        mutate({name, image, price, description})
      }} className="p-4 w-full flex items-center justify-center bg-black rounded-md text-white">{isLoading ? <LoadingSpinner size={24}/> : "Submit Camp"}</button>
    </div>
	)
}

SubmitCamp.getLayout= function(page: ReactElement){
	return (<Layout>{page}</Layout>)
}

export default SubmitCamp;