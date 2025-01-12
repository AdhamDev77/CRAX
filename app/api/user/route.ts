import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { pbkdf2Sync, randomBytes } from "crypto"; // Import randomBytes

// Utility function to hash the password
const hashPassword = (password: string, salt: string) => {
  return pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
};

// Generate a random salt
const generateSalt = () => {
  return randomBytes(16).toString("hex"); // Use randomBytes to generate salt
};


export async function POST(req: Request) {
  const { firstName, lastName, email, password } = await req.json();

  // Generate a salt and hash the password
  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: `${hashedPassword}:${salt}`,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        sites: {
          orderBy: {
            createdAt: 'desc', // Order sites by creation date in descending order
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstName } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: { firstName },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
