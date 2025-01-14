"use client";

import { useState, useEffect, useCallback } from 'react';
import { Puck, Render } from "../../../../../packages/core";
import headingAnalyzer from "../../../../../packages/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../../../../config";
import { useParams } from 'next/navigation';
import { Data } from '@measured/puck'; // Import the Data type from Puck
import axios from 'axios'; // Import axios
import { Link } from '@/i18n/routing';
import { Eye } from 'lucide-react';
import BuilderLoader from '@/components/BuilderLoader';

// Define a type for your site content
type SiteContent = Data<typeof config.components>;

export function Client({ isEdit }: { isEdit: boolean }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<SiteContent | null>(null);
  const [resolvedData, setResolvedData] = useState<SiteContent | null>(null);
  const { sitePath } = useParams();
  const resolvedSitePath = Array.isArray(sitePath) ? sitePath.join("/") : sitePath || "";

  // Memoize the fetchSiteData function to avoid re-creating it on every render
  const fetchSiteData = useCallback(async () => {
    if (resolvedSitePath) {
      try {
        const response = await axios.get(`/api/site/${resolvedSitePath}`);
        setData(response.data.content);
        setResolvedData(response.data.content);
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [resolvedSitePath]);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  // Memoize the onPublish handler to avoid re-creating it on every render
  const handlePublish = useCallback(
    async (publishData: SiteContent) => {
      try {
        const response = await axios.put(`/api/site/${resolvedSitePath}`, {
          content: publishData,
        });
        setData(response.data);
        setResolvedData(response.data);
      } catch (error) {
        console.error('Error updating site data:', error);
      }
    },
    [resolvedSitePath]
  );

  if (isEdit && data) {
    return (
      <div>
        <Puck
          config={config}
          data={data}
          onPublish={handlePublish}
          plugins={[headingAnalyzer]}
          headerPath={resolvedSitePath}
          overrides={{
            headerActions: ({ children }) => (
              <>
                <div>
                  <Link
                    href={`/site/${resolvedSitePath}`}
                    target='_blank'
                    className='flex gap-2 font-semibold justify-center items-center bg-white border text-black rounded-md h-[36px] px-4 text-[14px]'
                  >
                    <Eye className='w-5 h-5' /> View
                  </Link>
                </div>
                {children}
              </>
            ),
          }}
        />
      </div>
    );
  }

  if (loading) {
    return <BuilderLoader />;
  }

  if (resolvedData) {
    return <Render config={config} data={resolvedData} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    </div>
  );
}

export default Client;