'use client'

import PageLoader from "@/components/page-loader";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Artist, getArtist } from "@/lib/spotify";
import { error } from "console";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Remove() {
    const router = useRouter();
    const params = useSearchParams();
    const artistID = params.get('artist');

    const [artist, setArtist] = useState<Artist>();
    const [confirmation, setConfirmation] = useState("");

    const { data: session } = useSession();

    useEffect(() => {
        // verify that aristID parameter is present
        if (!artistID) {
            router.push('/search');
        }
        if (!session) return;

        getArtist(session.accessToken!, artistID!).then((res) => {
            setArtist(res);
        }).catch((error) => {
            if (error) {
                router.push('/search')
            }
        });
    }, [session]);

    if (!artist) {
        return (
            <PageLoader />
        );
    }

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmation(e.target.value);
    }

    const handleButton = () => {
        // 
    }

    return (
        <AuroraBackground className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-0">
            <Card className="min-h-[300px] relative flex flex-col justify-between p-4 sm:p-8">
                <div>
                    <h1 className="text-lg sm:text-2xl font-bold">Are you sure?</h1>
                    <p className="text-sm sm:text-base font-light">You are about to remove {artist.name} from all of your liked songs.</p>
                </div>
                <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm">Type <span className="font-bold">{artist.name}</span> to confirm</p>
                    <Input
                        placeholder="artist name..."
                        onChange={handleInput}
                    />
                </div>
                <div className="w-full flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button disabled={confirmation !== artist.name} className="bg-spotify-green">Confirm</Button>
                </div>
            </Card>
        </AuroraBackground>
    );
}