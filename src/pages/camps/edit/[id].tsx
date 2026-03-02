import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import Layout from "~/components/layout";
import type { NextPageWithLayout } from "../../_app";
import type { ReactElement } from "react";
import { LoadingSpinner } from "~/components/loading";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

const EditCamp: NextPageWithLayout = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const campId = typeof id === "string" ? id : "";

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const { data: campData, isLoading: isFetching } = api.camps.getOne.useQuery(
    { id: campId },
    { enabled: !!campId }
  );

  useEffect(() => {
    if (campData) {
      if (user && campData.campground.creatorId !== user.id) {
        toast.error("You are not authorized to edit this campground.");
        void router.push(`/camps/${campId}`);
        return;
      }
      setName(campData.campground.name);
      setImage(campData.campground.image);
      setPrice(campData.campground.price);
      setLocation(campData.campground.location ?? "");
      setDescription(campData.campground.description);
    }
  }, [campData, user, router, campId]);

  const { mutate, isLoading: isUpdating } = api.camps.update.useMutation({
    onError: (err) => {
      toast.error(err.message || "Something went wrong, please try again later");
    },
    onSuccess: () => {
      toast.success("Campground updated successfully!");
      void router.push(`/camps/${campId}`);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInputs = () => {
    if (name.length === 0 || price.length < 2 || location.length < 2) {
      toast.error("Please type in proper values in every field.");
      return false;
    }

    if (image.length === 0) {
      toast.error("Please provide an image.");
      return false;
    }

    if (description.length > 300 || description.length < 20) {
      toast.error("Please make sure your description is between 20 and 300 characters long.");
      return false;
    }

    return true;
  };

  if (isFetching) return <LoadingSpinner size={48} />;

  return (
    <div className="mx-auto flex w-5/6 flex-col gap-4 lg:w-3/6">
      <h1 className="py-2 text-2xl font-bold">Edit Campground</h1>
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
          Update Image (optional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="rounded-md bg-stone-100 p-2 text-slate-600"
          onChange={handleImageChange}
        />
        {image && (
          <div className="mt-2 text-xs text-slate-500">Image selected</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="text-sm font-bold text-slate-600">
          Location
        </label>
        <input
          type="text"
          id="location"
          className="rounded-md bg-stone-100 p-2 text-slate-600"
          placeholder="New York, NY"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          value={location}
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
          placeholder="Description here..."
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
        />
      </div>
      <button
        type="submit"
        disabled={isUpdating}
        onClick={() => {
          if (validateInputs())
            mutate({ id: campId, name, image, price, description, location });
        }}
        className="flex w-full items-center justify-center rounded-md bg-black p-4 text-white"
      >
        {isUpdating ? <LoadingSpinner size={24} /> : "Update Camp"}
      </button>
    </div>
  );
};

EditCamp.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EditCamp;
