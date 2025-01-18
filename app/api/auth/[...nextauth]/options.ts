import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Add Google Provider
import prisma from "../../../../lib/prisma";
import { pbkdf2Sync } from "crypto";
import { User as NextAuthUser } from "next-auth";

// TypeScript interface for your User object returned from Prisma
interface UserPrisma {
  id: string;
  email: string;
  password: string;
  accountType: string;
  userType: string | null;
  experienceLevel: string | null;
  referralSource: string | null;
  emailVerified: Date | null;
  verificationToken: string | null;
  verificationTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Convert Prisma user to NextAuth user
const toNextAuthUser = (user: UserPrisma): NextAuthUser => ({
  id: user.id,
  email: user.email,
  name: user.email, // Use email as the default name
});

const authorizeUser = async (credentials: { email: string; password: string }): Promise<NextAuthUser | null> => {
  if (!credentials.email || !credentials.password) {
    return null;
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user || !user.password) {
    return null;
  }

  // Extract hashed password and salt
  const [hashedPassword, salt] = user.password.split(":");

  // Hash the input password with the extracted salt
  const hashedInputPassword = pbkdf2Sync(credentials.password, salt, 1000, 64, "sha512").toString("hex");

  // Compare the hashed input password with the stored hashed password
  if (hashedInputPassword !== hashedPassword) {
    return null;
  }

  // Check if the user's email is verified
  if (!user.emailVerified) {
    throw new Error("Email not verified. Please check your email for a verification link.");
  }

  return toNextAuthUser(user);
};

export const options: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // Ensure this is set in your .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Ensure this is set in your .env file
    }),
    // Credentials Provider (for email/password login)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your email" },
        password: { label: "Password", type: "password", placeholder: "your password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          return await authorizeUser(credentials);
        } catch (error) {
          console.error("User login error:", error);
          throw new Error(error instanceof Error ? error.message : "An error occurred during login");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        // Check if the user already exists in your database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create a new user in your database
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || user.email, // Use Google's name or email as the name
              accountType: "individual", // Default account type
              emailVerified: new Date(), // Mark email as verified
            },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
        session.user.accountType = token.accountType as string;
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.accountType = (user as any).accountType; // Add accountType to the token
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default options;