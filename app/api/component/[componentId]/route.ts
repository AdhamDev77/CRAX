import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { options } from "../../auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

export async function GET(req: NextRequest, { params }: { params: any }) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { componentId } = params;

    const component = await prisma.component.findFirst({
      where: {
        name: componentId,
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, image, content, zones, category, subCategory } = body;
    const { componentId } = params;

    const existingComponent = await prisma.component.findFirst({
      where: {
        name: componentId,
      },
    });

    if (!existingComponent) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedComponent = await prisma.component.update({
      where: { name: componentId },
      data: {
        name,
        description,
        Image: image,
        category,
        subCategory,
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

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { componentId } = params;

    const component = await prisma.component.findFirst({
      where: {
        name: componentId,
      },
    });

    if (!component) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.component.delete({
      where: { name: componentId },
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
