'use client'
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { useUser } from '@auth0/nextjs-auth0/client';
import { TypewriterEffectSmoothDemo } from "./components/Mainpage";
import { HeroParallaxDemo } from "./components/Afterlogin";

export default function Home() {
  const { user, error, isLoading } = useUser();

  
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
    
      {user ? <HeroParallaxDemo /> : <TypewriterEffectSmoothDemo />}


    </>
  );
}

