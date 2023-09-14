import type { ReactNode } from "react";
import Navbar from "./navbar";
import Image from "next/image";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`font-body flex min-h-screen flex-col justify-between`}>
      <Navbar />
      <main className="mx-auto flex w-11/12 md:w-10/12 max-w-[1440px] flex-grow">
        {children}
      </main>
      <footer className="w-full">
        <div className="mx-auto flex w-11/12 md:w-10/12 max-w-[1440px] py-16">
          <Image src="/Logo.svg" height={40} width={120} alt="Yelp Camp Logo" />
        </div>
      </footer>
    </div>
  );
}
