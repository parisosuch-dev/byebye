'use client'

import { Artist } from "@/lib/spotify";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Remove() {
    const router = useRouter();
    const params = useSearchParams();
    const artistID = params.get('artist');

    const [artist, setArtist] = useState<Artist>();

    // verify that aristID parameter is present
    if (!artistID) {
        router.push('/search');
    }

    return <div>{artistID}</div>
}