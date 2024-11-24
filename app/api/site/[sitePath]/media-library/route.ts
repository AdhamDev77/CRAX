import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sitePath } = params;

  try {
    const body = await req.json();
    const { urls } = body; // Expecting an array of image URLs

    // Validate imageUrls
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Image URLs are required and must be an array" },
        { status: 400 }
      );
    }

    // Fetch the current mediaLibrary array for the site
    const site = await prisma.site.findUnique({
      where: { path: sitePath },
      select: { mediaLibrary: true },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Append the new image URLs to the existing mediaLibrary array
    const updatedMediaLibrary = [
      ...(site.mediaLibrary || []),
      ...urls // Spread operator to append new URLs
    ];

    // Update the site with the new mediaLibrary array
    const updatedSite = await prisma.site.update({
      where: { path: sitePath },
      data: { mediaLibrary: updatedMediaLibrary },
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    const { sitePath } = params;

    if (!sitePath) {
      return NextResponse.json(
        { error: 'Site path is required' },
        { status: 400 }
      );
    }

    const site = await prisma.site.findUnique({
      where: {
        path: sitePath,
      },
      select: {
        mediaLibrary: true,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(site.mediaLibrary);
  } catch (error) {
    console.error('Error fetching media library:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media library' },
      { status: 500 }
    );
  }
}
