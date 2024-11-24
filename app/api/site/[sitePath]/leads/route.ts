import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../../lib/prisma";
import { options } from "../../../auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

export async function GET(
  req: NextRequest,
  { params }: { params: any }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sitePath } = params;

  try {
    const site = await prisma.site.findUnique({
      where: { path: sitePath },
      select: { leads: true },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json(site.leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: any }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sitePath } = params;

  try {
    const body = await req.json();
    console.log('Request Body:', body); // Log the full body

    // Validate lead data
    if (!body) {
      return NextResponse.json(
        { error: "Lead data is required" },
        { status: 400 }
      );
    }

    const updatedSite = await prisma.site.update({
      where: { path: sitePath },
      data: { leads: { push: body } }, // Push the lead object
    });

    return NextResponse.json(updatedSite.leads);
  } catch (error) {
    console.error("Error adding lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: any }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sitePath } = params;

  try {
    const body = await req.json();
    const { leads } = body;

    // Validate leads data
    if (!Array.isArray(leads)) {
      return NextResponse.json(
        { error: "Leads should be an array" },
        { status: 400 }
      );
    }

    const updatedSite = await prisma.site.update({
      where: { path: sitePath },
      data: { leads },
    });

    return NextResponse.json(updatedSite.leads);
  } catch (error) {
    console.error("Error updating leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
