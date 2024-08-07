'use client'

import { getTracks } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

export default function App() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            getTracks(session.accessToken!).then((res) => console.log(res));
        }
    }, [session])

    if (!session) {
        return (
            <div className="w-full ">
                <BarLoader />
            </div>
        )
    };
    return (
        <div>we are logged in and have session</div>
    );
}
