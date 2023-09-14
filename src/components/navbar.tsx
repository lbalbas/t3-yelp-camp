import { SignInButton, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn, user } = useUser();

  return (
    <nav>
      <div className="mx-auto flex w-11/12 md:w-10/12 max-w-[1440px] items-center justify-between py-6">
        <div className="flex items-center gap-6">
          <Link href="/camps">
              <Image src="/Logo.svg" height={40} width={120} alt="Yelp Camp Logo" />
          </Link>
          <Link className="text-sm hidden md:inline-block font-bold text-slate-600" href="/camps">
            Home
          </Link>
        </div>
        {!isSignedIn && (
          <div className="flex gap-4">
            <SignInButton>
              <button className="rounded-md bg-black px-4 py-3 text-white">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
        {!!isSignedIn && <div className="flex gap-4 text-sm text-slate-600"><span className="font-bold">{user.username}</span><SignOutButton/></div>}
      </div>
    </nav>
  );
};

export default Navbar;
