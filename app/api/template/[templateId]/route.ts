import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]/options"; // Adjust the path if necessary

// Helper function to get session
async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

export async function GET(
  request: NextRequest,
  { params }: { params: any }
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
