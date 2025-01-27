import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]/options"; // Adjust the path if necessary

// Helper function to get session
async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

// GET: Fetch a single template by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = params;
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json({ error: "Error fetching template" }, { status: 500 });
  }
}

// DELETE: Delete a template by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = params;

    // Check if the template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Delete the template
    await prisma.template.delete({
      where: { id: templateId },
    });

    return NextResponse.json({ message: "Template deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ error: "Error deleting template" }, { status: 500 });
  }
}

// PUT: Update a template by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = params;
    const { title, description, content, image, category, features } = await request.json();

    // Check if the template exists
    const existingTemplate = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Update the template
    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: {
        title,
        description,
        content,
        image,
        category,
        features,
      },
    });

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json({ error: "Error updating template" }, { status: 500 });
  }
}