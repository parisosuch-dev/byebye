"use client";

import PageLoader from "@/components/page-loader";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScaleLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Artist,
  getArtist,
  getSavedTracksFromArtist,
  removeTracks,
  Track,
} from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

function Confirmation() {
  const router = useRouter();
  const params = useSearchParams();
  const artistID = params.get("artist");

  const [artist, setArtist] = useState<Artist>();
  const [confirmation, setConfirmation] = useState("");
  const [gettingTracks, setGettingTracks] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [finished, setFinished] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    // verify that aristID parameter is present
    if (!artistID) {
      router.push("/search");
    }
    if (!session) return;

    getArtist(session.accessToken!, artistID!)
      .then((res) => {
        setArtist(res);
      })
      .catch((error) => {
        if (error) {
          router.push("/search");
        }
      });
  }, [session]);

  if (!artist) {
    return <PageLoader />;
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmation(e.target.value);
  };

  const handleButton = () => {
    if (session && artistID) {
      setGettingTracks(true);
      getSavedTracksFromArtist(session.accessToken!, artistID).then((res) => {
        setTracks(res);
        setGettingTracks(false);
      });
    }
  };

  const handleDelete = () => {
    setDeleting(true);
    removeTracks(session?.accessToken!, tracks).then((res) => {
      setDeleting(false);
      setFinished(true);
    });
  };

  if (finished) {
    return (
      <AuroraBackground className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-0">
        <Card className="min-h-[200px] relative flex flex-col justify-center items-center space-y-8 p-4 sm:p-8">
          <h1 className="text-lg sm:text-2xl font-bold text-center">
            {tracks.length} track(s) removed from your library.
          </h1>
          <Button
            className="bg-spotify-green w-full"
            onClick={() => router.push("/")}
          >
            Home
          </Button>
        </Card>
      </AuroraBackground>
    );
  }

  if (deleting) {
    return (
      <AuroraBackground className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-0">
        <Card className="min-h-[300px] relative flex flex-col justify-center items-center space-y-8 p-4 sm:p-8">
          <h1 className="text-lg sm:text-2xl font-bold">
            No tracks for {artist.name} found in your Liked Songs.
          </h1>
          <Button
            className="bg-spotify-green"
            onClick={() => router.push("/search")}
          >
            Back to Search
          </Button>
        </Card>
      </AuroraBackground>
    );
  }

  if (tracks.length > 0) {
    return (
      <AuroraBackground className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-0">
        <Card className="min-h-[300px] sm:w-1/2 relative flex flex-col justify-center items-center space-y-6 p-4 sm:p-8">
          <h1 className="text-lg sm:text-2xl font-bold text-center">
            These tracks will be deleted from your Liked Songs...
          </h1>
          <div className="w-full space-y-2">
            {tracks.map((track) => (
              <div className="flex flex-row items-center p-2 space-x-4 w-full bg-gray-100 rounded-lg h-[60px]">
                <Avatar>
                  <AvatarImage
                    className="rounded-lg"
                    height={48}
                    width={48}
                    src={track.album.images[0] ? track.album.images[0].url : ""}
                  />
                  <AvatarFallback>
                    <div className="w-[48px] h-[48px] flex items-center justify-center">
                      <ScaleLoader width={4} height={8} />
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div>
                  {track.artists[0].name} - {track.name}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button className="bg-spotify-green" onClick={handleDelete}>
              Confirm
            </Button>
          </div>
        </Card>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-0">
      {gettingTracks ? (
        <Card className="min-h-[300px] relative flex flex-col justify-center items-center space-y-8 p-4 sm:p-8">
          <h1 className="text-lg sm:text-2xl font-bold text-center">
            Getting {artist.name} tracks from your Liked Songs...
          </h1>
          <BarLoader color="#1DB954" height={4} width={350} />
        </Card>
      ) : (
        <Card className="min-h-[300px] relative flex flex-col justify-between p-4 sm:p-8">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">Are you sure?</h1>
            <p className="text-sm sm:text-base font-light">
              You are about to remove {artist.name} from all of your liked
              songs.
            </p>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm">
              Type <span className="font-bold">{artist.name}</span> to confirm
            </p>
            <Input placeholder="artist name..." onChange={handleInput} />
          </div>
          <div className="w-full flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              disabled={
                confirmation.toLowerCase() !== artist.name.toLocaleLowerCase()
              }
              className="bg-spotify-green"
              onClick={handleButton}
            >
              Confirm
            </Button>
          </div>
        </Card>
      )}
    </AuroraBackground>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Confirmation />
    </Suspense>
  );
}
