import { PrismaClient } from '@prisma/client';
import ClientWrapper from './ClientWrapper';

// Initialize Prisma Client outside the function to reuse the same instance
const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: any }) {
  const { templateId } = params;

  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (template) {
      return {
        title: `CRAX: ${template.title} template`,
      };
    }
  } catch (error) {
    console.error('Error fetching template metadata:', error);
  }

  return {
    title: 'Template Not Found',
  };
}

export default async function Page({ params }: { params: any }) {
  const { templateId } = params;

  try {
    // Fetch the page data only once and reuse it for both metadata and rendering
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
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

    return <ClientWrapper isEdit={true} path={`template/${template.id}`} />;
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