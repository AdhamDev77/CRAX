import ClientWrapper from "../ClientWrapper";
import { Metadata } from "next";
import { PrismaClient } from '@prisma/client';

// Singleton Prisma client instance
const prisma = new PrismaClient();

interface PageParams {
  sitePath: string;
}

// Fetch site data
async function fetchSiteData(sitePath: string) {
  try {
    return await prisma.site.findUnique({
      where: { path: sitePath },
      select: { path: true }
    });
  } catch (error) {
    console.error('Error fetching site data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { sitePath } = params;
  const site = await fetchSiteData(sitePath);

  if (site) {
    return {
      title: sitePath.includes('edit') ? `Editing: ${site.path}` : site.path,
    };
  }

  return {
    title: "Page Not Found",
  };
}

export default async function Page({ params }: { params: PageParams }) {
  const { sitePath } = params;
  const site = await fetchSiteData(sitePath);

  if (!site) {
    return <div>Page not found</div>;
  }

  return <ClientWrapper isEdit={true} path={site.path} />;
}