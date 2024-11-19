// /api/site/[sitePath]/page/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { options } from "../../../auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
 return await getServerSession({ req, ...options });
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

   const site = await prisma.site.findFirst({
     where: {
       path: params.sitePath,
     },
   });
   if (!site) {
     return NextResponse.json({ error: "Site not found" }, { status: 404 });
   }

   const pages = await prisma.page.findMany({
     where: {
       siteId: site.id,
     },
     include: {
       children: true,
     },
     orderBy: {
       createdAt: "asc",
     },
   });

   return NextResponse.json(pages);
 } catch (error) {
   console.error("Error fetching pages:", error);
   return new NextResponse("Internal Error", { status: 500 });
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

   const site = await prisma.site.findFirst({
     where: {
       path: params.sitePath,
       userId: session.user.id,
     },
   });
   if (!site) {
     return NextResponse.json({ error: "Site not found" }, { status: 404 });
   }

   const { name, path, content, isPublished, templateId } = await req.json();
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

   const existingPage = await prisma.page.findFirst({
     where: {
       siteId: site.id,
       path,
     },
   });
   if (existingPage) {
     return NextResponse.json(
       { error: "Path must be unique within the site" },
       { status: 400 }
     );
   }

   const page = await prisma.page.create({
     data: {
       name,
       path,
       content: template.content,
       isPublished: isPublished || false,
       siteId: site.id,
     },
   });

   return NextResponse.json(page);
 } catch (error) {
   console.error("Error creating page:", error);
   return new NextResponse("Internal Error", { status: 500 });
 }
}