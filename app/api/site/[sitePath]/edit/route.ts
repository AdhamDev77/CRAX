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