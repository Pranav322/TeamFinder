'use client'
import { TypewriterEffectSmoothDemo } from "./components/Mainpage";
import { HeroParallaxDemo } from "./components/Afterlogin";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      {user ? <HeroParallaxDemo /> : <TypewriterEffectSmoothDemo />}
    </>
  );
}

