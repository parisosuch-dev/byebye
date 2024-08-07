"use client";

import Nav from "@/components/nav";
import PageLoader from "@/components/page-loader";
import { Input } from "@/components/ui/input";
import { Artist, searchArtist } from "@/lib/spotify";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

export default function App() {
  const { data: session } = useSession();
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    if (!session) return;
  }, [session]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setArtists([]);
      return;
    }
    searchArtist(session!.accessToken!, e.target.value).then((res) => {
      setArtists(res);
    });
  };

  if (!session) {
    return <PageLoader text="Loading App..." />;
  }
  return (
    <div className="w-full flex flex-col items-center">
      <Nav />
      <div className="w-full p-4 sm:p-0 sm:w-1/2 space-y-4">
        <h1 className="text-xl font-bold">Select An Artist</h1>
        <Input placeholder="search for an artist..." onChange={handleSearch} />
        {artists?.length > 0 ? (
          <div className="space-y-1 sm:max-h-[400px] overflow-y-scroll">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                className="flex flex-row items-center px-2 space-x-2 bg-gray-100 hover:bg-spotify-green hover:text-white transform ease-in duration-150 rounded-lg h-[64px]"
                href={`/remove?artist=${artist.id}`}
              >
                <Avatar>
                  <AvatarImage
                    className="rounded-lg h-[48px] bg-contain"
                    height={48}
                    width={48}
                    src={artist.images[0] ? artist.images[0].url : ""}
                  />
                  <AvatarFallback>
                    <div className="w-[48px] h-[48px] flex items-center justify-center">
                      <ScaleLoader width={4} height={8} />
                    </div>
                  </AvatarFallback>
                </Avatar>
                <p>{artist.name}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
