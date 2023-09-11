import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn, user } = useUser();

  return (
    <nav>
      <div className="mx-auto flex w-10/12 max-w-[1440px] items-center justify-between py-6">
        <div className="flex items-center gap-6">
          <Image src="/Logo.svg" height={40} width={120} alt="Yelp Camp Logo" />
          <Link className="text-sm font-bold text-slate-600" href="/">
            Home
          </Link>
        </div>
        {!isSignedIn && (
          <div className="flex gap-4">
            <SignInButton>
              <button>Login</button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-md bg-black px-4 py-3 text-white">
                Create an account
              </button>
            </SignUpButton>
          </div>
        )}
        {!!isSignedIn && <div className="flex gap-4">{user.firstName}</div>}
      </div>
    </nav>
  );
};

export default Navbar;
