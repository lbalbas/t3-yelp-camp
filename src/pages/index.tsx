import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="w-screen lg:flex lg:w-[55%] lg:justify-center">
        <div className="relative flex flex-col gap-10 py-10 lg:w-8/12 lg:gap-24">
          <div className="mx-auto flex w-10/12 lg:w-full">
            <Image
              alt="Yelp Camp Logo"
              src="/Logo.svg"
              height={40}
              width={120}
            />
          </div>
          <div className="absolute relative h-72 w-full lg:hidden">
            <Image
              alt="A camp in a hill, only visible on mobile and tablets"
              src="/Hero Image (Tablet and Mobile).jpg"
              fill
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div className="mx-auto flex w-10/12 flex-grow flex-col gap-6 lg:w-full">
            <h1 className="text-3xl font-bold md:text-5xl 2xl:text-5xl">
              Explore the best camps on Earth.
            </h1>
            <p className="text-slate-600">
              YelpCamp is a curated list of the best camping spots on Earth.
              Unfiltered and unbiased reviews.
            </p>
            <div className="flex flex-col gap-4 text-slate-600">
              <div className="flex items-center gap-3">
                <Image
                  src="/Checkmark.svg"
                  height={24}
                  width={24}
                  alt="Checkmark"
                />
                <span>Add your own camp suggestions.</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/Checkmark.svg"
                  height={24}
                  width={24}
                  alt="Checkmark"
                />
                <span>Leave reviews and experiences.</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/Checkmark.svg"
                  height={24}
                  width={24}
                  alt="Checkmark"
                />
                <span>See locations for all camps.</span>
              </div>
            </div>
            <Link
              href="/camps"
              className="flex w-44 items-center justify-center rounded-md bg-black px-2 py-4 text-white"
            >
              View Campgrounds
            </Link>
            <div className="flex flex-col text-slate-600">
              <span>Partnered with:</span>
              <div className="flex items-center">
                <Image src="/Airbnb.svg" height={30} width={120} alt="Airbnb" />
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
      <div className="relative hidden w-[45%] lg:block">
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
