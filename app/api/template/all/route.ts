import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const templates = await prisma.template.findMany();

    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching templates" },
      { status: 500 }
    );
  }
}
