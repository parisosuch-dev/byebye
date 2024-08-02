import NextAuth from "next-auth/next";
import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// verify spotify env variables are present
if (!process.env.SPOTIFY_CLIENT_ID) {
  throw "SPOTIFY_CLIENT_ID environment variable is missing.";
}
if (!process.env.SPOTIFY_CLIENT_SECRET) {
  throw "SPOTIFY_CLIENT_SECRET environment variable is missing.";
}

const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public",
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect users to /app after sign-in
      return baseUrl + "/app";
    },
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        token,
      };
    },
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
