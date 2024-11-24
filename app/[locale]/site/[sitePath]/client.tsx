"use client";

import { useState, useEffect } from 'react';
import { Button, Puck, Render } from "../../../../packages/core";
import headingAnalyzer from "../../../../packages/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../../../config";
import { useParams } from 'next/navigation';
import { Data } from '@measured/puck'; // Import the Data type from Puck
import { Link } from '@/i18n/routing';
import { Eye } from 'lucide-react';
import BuilderLoader from '@/components/BuilderLoader';

// Define a type for your site content


export function Client({ isEdit }: { isEdit: boolean }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [resolvedData, setResolvedData] = useState<any>(null);
  const { sitePath } = useParams();
  const resolvedSitePath = Array.isArray(sitePath) ? sitePath.join("/") : sitePath || "";

  useEffect(() => {
    async function fetchSiteData() {
      if (resolvedSitePath) {
        try {
          console.log(resolvedSitePath);
          const response = await fetch(`/api/site/${resolvedSitePath}`);
          if (!response.ok) {
            throw new Error('Failed to fetch site data');
          }
          const siteData = await response.json();
          setData(siteData.content);
          setTitle(siteData.metaTitle);
          setDescription(siteData.metaDescription);
          setIcon(siteData.metaIcon);
          setResolvedData(siteData.content);
          setLoading(false)
        } catch (error) {
          console.error('Error fetching site data:', error);
          setLoading(false)
        }
      }
    }

    fetchSiteData();
  }, [resolvedSitePath]);

  // Set metadata based on resolvedData
  useEffect(() => {
      if (title) {
        document.title = title;
      }
      if (description) {
        const metaDescription = document.querySelector("meta[name='description']");
        if (metaDescription) {
          metaDescription.setAttribute("content", description);
        } else {
          const meta = document.createElement("meta");
          meta.name = "description";
          meta.content = description;
          document.head.appendChild(meta);
        }
      }
      if (icon) {
        const linkIcon = document.querySelector("link[rel='icon']");
        if (linkIcon) {
          linkIcon.setAttribute("href", icon);
        } else {
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = icon;
          document.head.appendChild(link);
        }
      }
  }, [description, icon, resolvedData, title]);

  if (isEdit && data) {
    return (
      <div>
        <Puck
          config={config}
          data={data}
          onPublish={async (publishData) => {
            try {
              const response = await fetch(`/api/site/${resolvedSitePath}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: publishData }),
              });
              if (!response.ok) {
                throw new Error('Failed to update site data');
              }
              setData(publishData);
              setResolvedData(publishData);
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
                  <Link href={`/site/${resolvedSitePath}`} target='_blank' className='flex gap-2 font-semibold justify-center items-center bg-white border text-black rounded-md h-[36px] px-4 text-[14px]'>
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
