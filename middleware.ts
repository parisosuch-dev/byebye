import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret });

  // If there's no token, redirect to the home page ('/')
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow the request to proceed if the session exists
  return NextResponse.next();
}

// Apply the middleware to all routes except the root
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|api|/|spotify.png).*)",
};
