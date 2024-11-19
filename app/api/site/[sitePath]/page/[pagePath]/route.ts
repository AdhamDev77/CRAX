// app/api/sites/[siteId]/pages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from '@/lib/prisma';
import { options } from "../../../../auth/[...nextauth]/options";

async function getSession(req: NextRequest) {
  return await getServerSession({ req, ...options });
}

export async function POST(
  req: NextRequest,
  { params }: { params:  any }
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

    const body = await req.json();
    const { name, path, content, isPublished, templateId } = body;

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

    // Validate path uniqueness within the site
    const existingPage = await prisma.page.findFirst({
      where: {
        siteId: site.id,
        path,
      },
    });

    if (existingPage) {
      return new NextResponse("Path must be unique within the site", {
        status: 400,
      });
    }

    const parentPage = await prisma.page.findFirst({
      where: {
        path: params.pagePath,
      },
    });

    if (!parentPage) {
      return NextResponse.json({ error: "Parent page not found" }, { status: 404 });
    }

    // Create the new page
    const page = await prisma.page.create({
      data: {
        name,
        path,
        content: template.content,
        parentId: parentPage.id,
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

export async function PATCH(
  req: NextRequest,
  { params }: { params:  any }
) {
  try {
    // Get user session
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the page exists and belongs to the user
    const page = await prisma.page.findFirst({
      where: {
        path: params.pagePath,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Parse the request body
    const body = await req.json();
    const { name, path, content, isPublished } = body;

    // Update the page in the database
    const updatedPage = await prisma.page.update({
      where: {
        id: page.id,
      },
      data: {
        name,
        path,
        content,
        isPublished,
      },
    });

    // Return the updated page data
    console.log(updatedPage)
    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params:  any }
  ) {
    try {
      const session = await getSession(req);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Check if this is the home page
      const page = await prisma.page.findFirst({
        where: {
          path: params.pagePath,
        },
      });
  
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

  
      const deletedPage = await prisma.page.delete({
        where: {
          id: page.id,
        },
      });
  
      return NextResponse.json(deletedPage);
    } catch (error) {
      console.error('Error deleting page:', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

  export async function GET(
    req: NextRequest,
    { params }: { params:  any }
  ) {
    try {
      const session = await getSession(req);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Find the site to ensure it belongs to the user
      const site = await prisma.site.findFirst({
        where: {
          path: params.sitePath,
          userId: session.user.id,
        },
      });
  
      if (!site) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
      }
  
      // Find the page within the site by its path
      const page = await prisma.page.findFirst({
        where: {
          siteId: site.id,
          path: params.pagePath,
        },
      });
  
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
  
      return NextResponse.json(page);
    } catch (error) {
      console.error("Error retrieving page:", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  