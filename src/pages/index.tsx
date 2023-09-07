import Link from "next/link";
import Image from 'next/image';

export default function Home() {
  return (
      <div className="flex min-h-screen w-full">
        <div className ="lg:flex lg:justify-center w-screen lg:w-[55%]">
          <div className="relative flex flex-col gap-10 lg:gap-24 py-10 lg:w-8/12">
            <div className="mx-auto flex w-10/12 lg:w-full">
              <Image
                alt="Yelp Camp Logo"
                src="/Logo.svg"
                height={40}
                width={120}
              />
            </div>
            <div className="lg:hidden absolute relative w-full h-72">
              <Image
                alt="A camp in a hill, only visible on mobile"
                src="/Hero Image (Tablet and Mobile).jpg"
                fill
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="w-10/12 mx-auto lg:w-full flex-grow flex-col flex gap-6">
              <h1 className="text-3xl md:text-5xl 2xl:text-5xl font-bold">Explore the best camps on Earth.</h1>
              <p className="text-slate-600">YelpCamp is a curated list of the best camping spots on Earth. Unfiltered and unbiased reviews.</p>
              <div className="flex flex-col gap-4 text-slate-600">
                <div className="flex items-center gap-3">
                  <Image src="/Checkmark.svg" height={24} width={24} alt="Checkmark"/>
                  <span>Add your own camp suggestions.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image src="/Checkmark.svg" height={24} width={24} alt="Checkmark"/>
                  <span>Leave reviews and experiences.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image src="/Checkmark.svg" height={24} width={24} alt="Checkmark"/>
                  <span>See locations for all camps.</span>
                </div>
              </div>
              <button className="bg-black text-white rounded-md w-44 px-2 py-4">View Campgrounds</button>
              <div className="flex flex-col text-slate-600">
                <span>Partnered with:</span>
                 <div className="flex items-center">
                   <Image
                     src="/Airbnb.svg"
                     height={30}
                     width={120}
                     alt="Airbnb"
                     />
                     <Image
                     src="/Booking.svg"
                     height={30}
                     width={120}
                     alt="Booking"
                     />
                     <Image
                     src="/Plum Guide.svg"
                     height={30}
                     width={120}
                     alt="Plum Guide"
                     />
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-[45%]">
          <Image
            alt="A camp in a hill, only visible on desktops"
            src="/Hero Image.jpg"
            fill
            objectFit="cover"
            objectPosition="center"
          />
        </div>
      </div>
  );
}
