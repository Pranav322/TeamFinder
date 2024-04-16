"use client";
import Link from "next/link";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Find",
    },
    {
      text: "Your Perfect",
    },
    {
      text: "Team",
    },
    {
      text: "With",
    },
    {
      text: "Teammfinder",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        Partnership builds here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          <Link href = "/api/auth/login">
          Join now
          </Link>
        
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
        <Link href = "/api/auth/login">
          Signup
          </Link>
        
        </button>
      </div>
    </div>
  );
}
