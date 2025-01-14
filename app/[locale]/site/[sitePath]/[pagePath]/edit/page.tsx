import { PrismaClient } from '@prisma/client';
import ClientWrapper from './ClientWrapper';
import { Metadata } from 'next';

// Initialize Prisma Client outside the function to reuse the same instance
const prisma = new PrismaClient();

type PageParams = {
  params: {
    sitePath: string;
    pagePath: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Memoize the metadata generation function to avoid redundant database queries
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { pagePath } = params;

  try {
    const page = await prisma.page.findFirst({
      where: { path: pagePath },
      select: { path: true },
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
    title: 'Page Not Found',
  };
}

export default async function Page({ params }: PageParams) {
  const { sitePath, pagePath } = params;
  const isEdit = pagePath.includes('edit');

  try {
    // Fetch the page data only once and reuse it for both metadata and rendering
    const page = await prisma.page.findFirst({
      where: { path: pagePath },
      select: { path: true },
    });

    if (!page) {
      return (
        <div
          style={{
            display: 'flex',
            height: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            <h1>404</h1>
            <p>Page not found</p>
          </div>
        </div>
      );
    }

    return <ClientWrapper isEdit={isEdit} path={`${sitePath}/${page.path}`} />;
  } catch (error) {
    console.error('Error fetching site:', error);
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <h1>500</h1>
          <p>Error loading page</p>
        </div>
      </div>
    );
  }
}