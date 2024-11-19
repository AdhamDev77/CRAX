import { PrismaClient } from '@prisma/client';

// Extend the global object to include 'prisma'
declare global {
  // Use `var` instead of `let` or `const` to allow the global definition
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, reuse the global prisma instance to avoid creating multiple connections
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
