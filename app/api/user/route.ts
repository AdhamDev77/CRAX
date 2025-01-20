import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";


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