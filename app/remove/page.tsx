'use client'

import PageLoader from "@/components/page-loader";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Artist, getArtist } from "@/lib/spotify";
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
        <AuroraBackground className="min-h-screen flex flex-col items-center justify-center">
            <Card className="w-1/3 min-h-[300px] relative flex flex-col justify-between p-8">
                <div>
                    <h1 className="text-2xl font-bold">Are you sure?</h1>
                    <p className="font-light">You are about to remove {artist.name} from all of your liked songs.</p>
                </div>
                <div className="pt-8">
                    <p className="text-sm">Type <span className="font-bold">{artist.name}</span> to confirm</p>
                    <Input
                        placeholder="artist name..."
                        onChange={handleInput}
                    />
                </div>
                <div className="pt-4 w-full flex justify-end">
                    <Button disabled={confirmation !== artist.name} className="bg-spotify-green">confirm</Button>
                </div>
            </Card>
        </AuroraBackground>
    );
}