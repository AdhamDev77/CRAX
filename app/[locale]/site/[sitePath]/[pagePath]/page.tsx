import { PrismaClient } from '@prisma/client';
import ClientWrapper from "./ClientWrapper";

const prisma = new PrismaClient();

export async function generateMetadata({
  params,
}: {
  params:  any;
}){
  const { sitePath, pagePath } = params;

  try {

    const page = await prisma.page.findFirst({
      where: { path: pagePath },
      select: { path: true }
    });

    if (page) {
      return {
        title: pagePath.includes('edit') ? `Editing: ${page.path}` : page.path,
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
  params:  any;
}) {
  const { sitePath, pagePath } = params;
  const isEdit = sitePath.includes('edit');

  try {

    const page = await prisma.page.findFirst({
      where: {
        path: pagePath // Use the cleaned path
      },
      select: {
        path: true
      }
    });

    if (!page) {
      console.log(pagePath);
      return <div>Page not found</div>;
    }

    return <ClientWrapper isEdit={isEdit} path={`${sitePath}/${page.path}`} />;
  } catch (error) {
    console.error('Error fetching site:', error);
    return <div>Error loading page</div>;
  }
}
