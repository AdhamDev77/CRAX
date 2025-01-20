import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../lib/prisma";
import { options } from "../../auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

export async function GET(
  req: NextRequest,
  { params }: { params: any }
) {
  const { sitePath } = params;

  try {
    const site = await prisma.site.findUnique({
      where: { path: sitePath },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error fetching site:", error);
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
    let body;

    // Safely parse the JSON body
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid or missing request body" },
        { status: 400 }
      );
    }

    const { name, templateId, path, metaTitle, metaDescription, metaIcon } =
      body || {};

      console.log("ID:",session.user.id)

    // Validate site data
    if (!name) {
      return NextResponse.json(
        { error: "Site name is required" },
        { status: 400 }
      );
    }
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }
    if (!templateId) {
      return NextResponse.json(
        { error: "Site initial template id is required" },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template || template.content == null) {
      return NextResponse.json(
        { error: "Template content not found" },
        { status: 400 }
      );
    }

    // Create the initial site record with template content
    const newSite = await prisma.site.create({
      data: {
        name,
        content: template.content,
        path,
        userId: session.user.id,
        metaTitle,
        metaDescription,
        metaIcon,
      },
    });

    return NextResponse.json(newSite);
  } catch (error) {
    console.error("Error creating site:", error);
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
    const { content } = body;

    // Validate site data
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const updatedSite = await prisma.site.update({
      where: { path: sitePath },
      data: { content: content },
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

export async function PATCH(
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

    // Validate body data
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    const updatedSite = await prisma.site.update({
      where: { path: sitePath },
      data: { ...body },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: any }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sitePath } = params;

  try {
    await prisma.site.delete({
      where: { path: sitePath },
    });

    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
