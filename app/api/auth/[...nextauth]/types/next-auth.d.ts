// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the NextAuth User type to match your Prisma User model
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string; // Ensure this matches the id field in your User model
    firstName?: string | null; // This is optional based on your schema
    lastName?: string | null; // This is optional based on your schema
    email: string; // Email is required in your schema
    image?: string | null; // Optional image property
  }

  interface Session extends DefaultSession {
    user: {
      id: string; // This should match the User id
      firstName?: string | null; // Optional, as per your schema
      lastName?: string | null; // Optional, as per your schema
      email: string; // Email should be included
      image?: string | null; // Optional image property
    };
  }
}

// Extend the JWT interface to include uid
declare module "next-auth/jwt" {
  interface JWT {
    uid: string; // Matches the id field from your User model
    name?: string | null; // Optional, can be included if you want
    email: string; // Required email
    image?: string | null; // Optional image property
  }
}
