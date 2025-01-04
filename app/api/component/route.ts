import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { options } from "../auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

// GET handler for retrieving a component
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const components = await prisma.component.findMany();

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler for creating a new component
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, image, content, zones } = body;

    // Validate component data
    if (!name) {
      return NextResponse.json(
        { error: "Component name is required" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Component content is required" },
        { status: 400 }
      );
    }

    // Create the component
    const newComponent = await prisma.component.create({
      data: {
        name,
        description: description || "",
        Image: image || "",
        content,
        zones,
      },
    });

    return NextResponse.json(newComponent);
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT handler for updating a component
export async function PUT(
  req: NextRequest,
  { params }: { params: { componentId: string } }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { componentId } = params;

  try {
    const body = await req.json();
    const { name, description, image, content, zones } = body;

    // Validate component exists and belongs to user
    const existingComponent = await prisma.component.findFirst({
      where: {
        id: componentId,
      },
    });

    if (!existingComponent) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the component
    const updatedComponent = await prisma.component.update({
      where: { id: componentId },
      data: {
        name,
        description,
        Image: image,
        content,
        zones,
      },
    });

    return NextResponse.json(updatedComponent);
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a component
export async function DELETE(
  req: NextRequest,
  { params }: { params: { componentId: string } }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { componentId } = params;

  try {
    // Verify component exists and belongs to user
    const component = await prisma.component.findFirst({
      where: {
        id: componentId,
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the component
    await prisma.component.delete({
      where: { id: componentId },
    });

    return NextResponse.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}