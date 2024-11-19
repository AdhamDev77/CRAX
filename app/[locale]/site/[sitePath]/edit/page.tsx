import ClientWrapper from "../ClientWrapper";
import { Metadata } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateMetadata({
  params,
}: {
  params: any;
}){
  const { sitePath } = params;

  try {

    const site = await prisma.site.findUnique({
      where: { path: sitePath },
      select: { path: true }
    });

    if (site) {
      return {
        title: sitePath.includes('edit') ? `Editing: ${site.path}` : site.path,
      };
    }
  } catch (error) {
    console.error('Error fetching site metadata:', error);
  }

  return {
    title: "Page Not Found",
  };
}

export default async function Page({
  params,
}: {
  params: any;
}) {
  const { sitePath } = params;

  try {

    const site = await prisma.site.findUnique({
      where: {
        path: sitePath // Use the cleaned path
      },
      select: {
        path: true
      }
    });

    if (!site) {
      console.log(sitePath);
      return <div>Page not found</div>;
    }

    return <ClientWrapper isEdit={true} path={site.path} />;
  } catch (error) {
    console.error('Error fetching site:', error);
    return <div>Error loading page</div>;
  }
}
