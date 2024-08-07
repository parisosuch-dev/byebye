"use client";

import PageLoader from "@/components/page-loader";
import { getTracks } from "@/lib/spotify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function App() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      getTracks(session.accessToken!).then((res) => console.log(res));
    }
  }, [session]);

  if (!session) {
    return <PageLoader text="Loading App..." />;
  }
  return <div>we are logged in and have session</div>;
}
