"use client";

import { useState, useEffect, useMemo } from 'react';
import { Puck, Render } from "../../../../packages/core";
import headingAnalyzer from "../../../../packages/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../../../config";
import { useParams } from 'next/navigation';
import { Data } from '@measured/puck'; // Import the Data type from Puck
import { Link } from '@/i18n/routing';
import { Eye } from 'lucide-react';
import BuilderLoader from '@/components/BuilderLoader';

interface SiteData {
  content: Data;
  metaTitle: string;
  metaDescription: string;
  metaIcon: string;
}

export function Client({ isEdit }: { isEdit: boolean }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const { sitePath } = useParams();
  const resolvedSitePath = Array.isArray(sitePath) ? sitePath.join("/") : sitePath || "";

  // Fetch site data
  useEffect(() => {
    async function fetchSiteData() {
      if (!resolvedSitePath) return;

      try {
        const response = await fetch(`/api/site/${resolvedSitePath}`);
        if (!response.ok) throw new Error('Failed to fetch site data');
        const data = await response.json();
        setSiteData(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSiteData();
  }, [resolvedSitePath]);

  // Update metadata
  useEffect(() => {
    if (!siteData) return;

    const { metaTitle, metaDescription, metaIcon } = siteData;

    if (metaTitle) document.title = metaTitle;

    const updateMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name='${name}']`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    if (metaDescription) updateMetaTag('description', metaDescription);

    const updateIcon = (href: string) => {
      let linkIcon = document.querySelector("link[rel='icon']");
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.setAttribute('rel', 'icon');
        document.head.appendChild(linkIcon);
      }
      linkIcon.setAttribute('href', href);
    };

    if (metaIcon) updateIcon(metaIcon);
  }, [siteData]);

  // Handle publishing data
  const handlePublish = useMemo(() => async (publishData: Data) => {
    try {
      const response = await fetch(`/api/site/${resolvedSitePath}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: publishData }),
      });
      if (!response.ok) throw new Error('Failed to update site data');
      setSiteData((prev) => prev ? { ...prev, content: publishData } : null);
    } catch (error) {
      console.error('Error updating site data:', error);
    }
  }, [resolvedSitePath]);

  if (loading) return <BuilderLoader />;

  if (!siteData) {
    return (
      <div style={{ display: "flex", height: "100vh", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
        <div>
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </div>
    );
  }

  if (isEdit) {
    return (
      <div>
        <Puck
          config={config}
          data={siteData.content}
          onPublish={handlePublish}
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

  return <Render config={config} data={siteData.content} />;
}

export default Client;