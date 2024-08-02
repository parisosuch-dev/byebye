// next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    token?: JWT;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    expires?: number;
    iat?: number;
    jti?: string;
  }
}
