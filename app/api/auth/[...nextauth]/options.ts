import type { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";
import prisma from "../../../../lib/prisma";
import { pbkdf2Sync, randomBytes, randomInt } from "crypto";
import { parse } from "cookie";
import { z } from "zod";

// Strong typing for user-related interfaces
interface UserPrisma {
  id: string;
  email: string;
  name?: string | null;
  password?: string | null;
  accountType: string;
  userType?: string | null;
  experienceLevel?: string | null;
  referralSource?: string | null;
  emailVerified?: Date | null;
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    accountType: string;
    name?: string;
  };
}

interface ExtendedToken extends JWT {
  uid: string;
  email: string;
  accountType: string;
}

// Password utilities
const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${hashedPassword}:${salt}`;
};

const verifyPassword = (password: string, storedHash: string): boolean => {
  const [hashedPassword, salt] = storedHash.split(":");
  const hashedInputPassword = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hashedInputPassword === hashedPassword;
};

// OTP utilities
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export const generateOTP = (email: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  otpStore[email] = { otp, expiresAt };
  return otp;
};

const verifyOTP = (email: string, otp: string): boolean => {
  const storedOTP = otpStore[email];

  if (!storedOTP || storedOTP.expiresAt < Date.now()) {
    return false; // OTP expired or doesn't exist
  }

  return storedOTP.otp === otp;
};

// Move email sending to a separate API route
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: "Your One-Time Password (OTP)",
        html: `
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 5 minutes.</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Helper function to get locale from request
const getLocaleFromRequest = (req: any): string => {
  const cookies = parse(req?.headers?.cookie || "");
  return cookies.NEXT_LOCALE || "en";
};

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@gmail.com" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null;

        if (!credentials.email.endsWith("@gmail.com")) {
          throw new Error("Please use a Gmail address.");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (credentials.otp && !verifyOTP(credentials.email, credentials.otp)) {
            throw new Error("Invalid or expired OTP");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error instanceof Error ? error : new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email!.toLowerCase() },
          });

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!.toLowerCase(),
                name: profile?.name || user.name || user.email,
                accountType: "individual",
                emailVerified: new Date(),
                goals: [],
              },
            });
            user.id = newUser.id;
          } else {
            user.id = existingUser.id;
          }
        }

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email!.toLowerCase() },
        });

        if (!dbUser?.goals?.length) {
          const locale = getLocaleFromRequest({ headers: {} });
          const encodedEmail = encodeURIComponent(user.email!);
          return `/${locale}/onboarding?email=${encodedEmail}`;
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          id: token.uid,
          email: token.email,
          accountType: token.accountType,
          name: session.user.name,
        },
      };
    },
    async jwt({ token, user, account }): Promise<ExtendedToken> {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email!.toLowerCase() },
        });

        if (dbUser) {
          return {
            ...token,
            uid: dbUser.id,
            email: dbUser.email,
            accountType: dbUser.accountType,
          };
        }
      }
      return token as ExtendedToken;
    },
  },
  pages: {
    signIn: "/[locale]/signin",
    error: "/[locale]/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};