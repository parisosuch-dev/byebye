import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SessionWrapper from "@/components/session-wrapper";
import { Suspense } from "react";

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
      <Suspense fallback={null}>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </Suspense>

    </SessionWrapper>
  );
}
