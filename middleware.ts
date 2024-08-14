import { getSession } from "next-auth/react";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    NextResponse.redirect("/");
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/about/:path*",
};
