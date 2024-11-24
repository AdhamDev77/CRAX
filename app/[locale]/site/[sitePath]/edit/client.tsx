"use client";

import { useState, useEffect } from 'react';
import { Button, Puck, Render } from "../../../../../packages/core";
import headingAnalyzer from "../../../../../packages/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../../../../config";
import { redirect, useParams } from 'next/navigation';
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

  useEffect(() => {
    async function fetchSiteData() {
      if (resolvedSitePath) {
        try {
          const response = await axios.get(`/api/site/${resolvedSitePath}`);
          setData(response.data.content);
          setResolvedData(response.data.content);
          setLoading(false)
        } catch (error) {
          console.error('Error fetching site data:', error);
          setLoading(false)
        }
      }
    }

    fetchSiteData();
  }, [resolvedSitePath]);

  if (isEdit && data) {
    return (
      <div>
        <Puck
          config={config}
          data={data}
          onPublish={async (publishData) => {
            try {
              const response = await axios.put(`/api/site/${resolvedSitePath}`, {
                content: publishData,
              });
              setData(response.data);
              setResolvedData(response.data);
            } catch (error) {
              console.error('Error updating site data:', error);
            }
          }}
          plugins={[headingAnalyzer]}
          headerPath={resolvedSitePath}
          overrides={{
            headerActions: ({ children }) => (
              <>
                <div>
                <Link href={`/site/${resolvedSitePath}`} target='_blank' className='flex gap-2 font-semibold justify-centr items-center bg-white border text-black rounded-md h-[36px] px-4 text-[14px]'>
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
