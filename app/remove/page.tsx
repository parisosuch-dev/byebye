"use client";

import PageLoader from "@/components/page-loader";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Artist, getArtist, removeArtist, Track } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

export default function Remove() {
  const router = useRouter();
  const params = useSearchParams();
  const artistID = params.get("artist");

  const [artist, setArtist] = useState<Artist>();
  const [confirmation, setConfirmation] = useState("");
  const [removing, setRemoving] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);

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
      setRemoving(true);
      removeArtist(session.accessToken!, artistID).then((res) => {
        setTracks(res);
        setRemoving(false);
      });
    }
  };

  return (
    <AuroraBackground className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-0">
      {removing ? (
        <Card className="min-h-[300px] relative flex flex-col justify-center items-center space-y-8 p-4 sm:p-8">
          <h1 className="text-lg sm:text-2xl font-bold">
            Removing {artist.name} from your Liked Songs...
          </h1>
          <Suspense>
            <BarLoader color="#1DB954" height={4} width={350} />
          </Suspense>
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
