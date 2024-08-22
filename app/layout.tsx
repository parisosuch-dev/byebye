import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SessionWrapper from "@/components/session-wrapper";
import { Suspense } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "byebye",
  description: "Spotify Artist Cleanser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <div className="h-[48px] bg-spotify-black flex flex-row text-spotify-white p-4 w-full justify-center text-xs sm:text-sm">
            <p>
              made by{" "}
              <Link href="https://parisosuch.com" className="underline">
                paris osuch
              </Link>
            </p>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
