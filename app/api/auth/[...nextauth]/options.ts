import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../lib/prisma";
import { promisify } from 'util';
import { pbkdf2Sync } from 'crypto';
import { User as NextAuthUser } from "next-auth";

const scrypt = promisify(pbkdf2Sync);

interface Credentials {
  email: string;
  password: string;
}

// TypeScript interface for your User object returned from Prisma
interface UserPrisma {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  password: string;
  createdAt: Date;
}

// Convert Prisma user to NextAuth user
const toNextAuthUser = (user: UserPrisma): NextAuthUser => ({
  id: user.id,
  firstName: user.firstName ?? undefined,
  lastName: user.lastName ?? undefined,
  email: user.email,
});

const authorizeUser = async (credentials: Credentials): Promise<NextAuthUser | null> => {
  if (!credentials.email || !credentials.password) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user || !user.password) {
    return null;
  }

  // Extract hashed password and salt
  const [hashedPassword, salt] = user.password.split(':');
  
  // Hash the input password with the extracted salt
  const hashedInputPassword = pbkdf2Sync(credentials.password, salt, 1000, 64, 'sha512').toString('hex');

  if (hashedInputPassword !== hashedPassword) {
    return null;
  }

  return toNextAuthUser(user);
};

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your email' },
        password: { label: 'Password', type: 'password', placeholder: 'your password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          return await authorizeUser(credentials as Credentials);
        } catch (error) {
          console.error("User login error:", error);
          return null;
        }
      },
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default options;
