import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../../lib/prisma";
import { options } from "../../../auth/[...nextauth]/options";
import { Site } from "@/app/[locale]/types";

async function getSession(req: NextRequest) {
  return await getServerSession(options);
}

export async function GET(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sitePath } = params;

    const site = await prisma.site.findUnique({
      where: { path: sitePath },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const siteData = site as Site;
    return NextResponse.json(siteData.content.root.props);
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
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sitePath } = params;
    const body: Record<string, any> = await req.json();

    const site = await prisma.site.findUnique({
      where: { path: sitePath },
    }) as Site | null;

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Deep clone the existing content
    const updatedContent = JSON.parse(JSON.stringify(site.content));
    
    // Update only the root props while preserving everything else
    if(body.bgColor){
      updatedContent.root = {
        ...updatedContent.root,
        props: {
          ...(updatedContent.root?.props || {}),
          bgColor: body.bgColor,
        }
      };
    }else if(body.font){
      updatedContent.root = {
        ...updatedContent.root,
        props: {
          ...(updatedContent.root?.props || {}),
          font: body.font,
        }
      };
    }


    // Update the site record with the modified content
    const updatedSite = await prisma.site.update({
      where: {
        path: sitePath,
      },
      data: {
        content: updatedContent
      },
    }) as Site;

    return NextResponse.json(updatedSite.content.root.props);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}