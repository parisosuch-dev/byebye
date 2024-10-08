"use client";

import Nav from "@/components/nav";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSpotifyButton = () => {
    if (!session) {
      signIn("spotify", { callbackUrl: "/search", redirect: true });
    } else {
      router.push("/search");
    }
  };

  return (
    <AuroraBackground className="min-h-screen flex flex-col">
      <Nav />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-1 flex-col"
      >
        <div className="relative flex flex-1 flex-col gap-1 sm:gap-4 items-center justify-center px-4">
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Remove Unwanted Spotify Artists
          </div>
          <div className="font-extralight text-center text-base md:text-4xl dark:text-neutral-200 py-4">
            With the click of a button (and some other buttons)
          </div>
          <div className="pt-4 sm:pt-0">
            <Button
              onClick={handleSpotifyButton}
              className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 space-x-2"
            >
              <Image
                src="/spotify.png"
                alt="spotify logo"
                width={16}
                height={16}
              />
              <p> Start Removing</p>
            </Button>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
