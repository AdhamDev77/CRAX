import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../../lib/prisma";
import { pbkdf2Sync, randomBytes } from "crypto";
import { User as NextAuthUser } from "next-auth";
import { parse } from "cookie"; // To parse cookies

// TypeScript interface for your User object returned from Prisma
interface UserPrisma {
  id: string;
  email: string;
  password: string | null; // Password is optional
  accountType: string;
  userType: string | null;
  experienceLevel: string | null;
  referralSource: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Convert Prisma user to NextAuth user
const toNextAuthUser = (user: UserPrisma): NextAuthUser => ({
  id: user.id,
  email: user.email,
  name: user.email, // Use email as the default name
});

// Hash password with a dynamically generated salt
const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex"); // Generate a random salt
  const hashedPassword = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${hashedPassword}:${salt}`; // Store hashed password and salt together
};

// Verify password against the stored hash
const verifyPassword = (password: string, storedHash: string): boolean => {
  const [hashedPassword, salt] = storedHash.split(":");
  const hashedInputPassword = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hashedInputPassword === hashedPassword;
};

const authorizeUser = async (credentials: { email: string; password: string }): Promise<NextAuthUser | null> => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required.");
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user || !user.password) {
    throw new Error("User not found or password is missing.");
  }

  // Verify the password
  if (!verifyPassword(credentials.password, user.password)) {
    throw new Error("Invalid password.");
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
      async authorize(credentials, req) {
        if (!credentials) return null;

        // Parse cookies from the request
        const cookies = parse(req.headers?.cookie || "");
        const locale = cookies.NEXT_LOCALE || "en"; // Default to 'en' if locale is not found

        try {
          const user = await authorizeUser(credentials);
          if (user) {
            // Attach the locale to the user object
            (user as any).locale = locale;
          }
          return user;
        } catch (error) {
          console.error("User login error:", error);
          throw new Error(error instanceof Error ? error.message : "An error occurred during login");
        }
      },
    }),
  ],
  pages: {
    signIn: "/[locale]/dashboard", // Dynamic sign-in page based on locale
    error: "/[locale]/dashboard", // Dynamic error page based on locale
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
  
        if (!existingUser) {
          // Create a new user if none exists
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || user.email,
              accountType: "individual",
              emailVerified: new Date(),
            },
          });
          user.id = newUser.id; // Link the MongoDB `id`
        } else {
          user.id = existingUser.id; // Use the existing MongoDB `id`
        }
      }
  
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string; // Use MongoDB `id` from token
        session.user.email = token.email as string;
        session.user.accountType = token.accountType as string || null;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
  
        if (existingUser) {
          token.uid = existingUser.id; // MongoDB `id`
          token.email = existingUser.email;
          token.accountType = existingUser.accountType;
        }
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
