"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { AuthButton } from "./AuthButton";

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
        <AuthButton variant="primary">Join now</AuthButton>
        <AuthButton variant="secondary">Signup</AuthButton>
      </div>
    </div>
  );
}
