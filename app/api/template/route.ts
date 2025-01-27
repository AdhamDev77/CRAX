import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate request body
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { title, description, content, image, category, features } = body;

    // Validate required fields
    if (!title || !description || !image || !category || !features) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure features is an array
    const featuresArray = Array.isArray(features) ? features : [features];

    // Create template in the database
    const template = await prisma.template.create({
      data: {
        title,
        description,
        image,
        category,
        features: featuresArray, // Pass as an array
        content,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: `Error creating template: ${error.message}` },
      { status: 500 }
    );
  }
}