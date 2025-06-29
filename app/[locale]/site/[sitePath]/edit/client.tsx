"use client";

import { useState, useEffect, useCallback } from 'react';
import { Puck, Render } from "../../../../../packages/core";
import headingAnalyzer from "../../../../../packages/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../../../../config";
import { useParams } from 'next/navigation';
import { Data } from '@measured/puck';
import axios from 'axios';
import { Link } from '@/i18n/routing';
import { Eye, Palette } from 'lucide-react';
import BuilderLoader from '@/components/BuilderLoader';
import createEmotionCachePlugin from '@/packages/plugin-emotion-cache';
import { BrandProvider, useBrand, BrandSidebar } from '@/packages/core/components/Puck/components/BrandSidebar'; // Adjust import pathr } from '@/packages/core/components/Puck/components/BrandSidebar'; // Adjust import pathr } from '@/packages/core/components/Puck/components/BrandSidebar'; // Adjust import pathr } from '@/packages/core/components/Puck/components/BrandSidebar'; // Adjust import pathr } from '@/packages/core/components/Puck/components/BrandSidebar'; // Adjust import path

// Define a type for your site content
type SiteContent = Data<typeof config.components>;

// Color mapping for brand theme integration
const COLOR_MAPPINGS = {
  'bgColor': 'background',
  'backgroundColor': 'background',
  'primaryColor': 'primary',
  'secondaryColor': 'secondary',
  'accentColor': 'accent',
  'fontColor': 'primary',
  'textColor': 'primary',
  'borderColor': 'secondary',
} as const;

// Helper function to deeply traverse and update colors in data structure
function updateColorsInData(data: any, getColor: (colorName: string) => string): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => updateColorsInData(item, getColor));
  }

  const updated = { ...data };

  // Update colors in current object
  Object.keys(COLOR_MAPPINGS).forEach(colorKey => {
    if (updated[colorKey] !== undefined) {
      const brandColorKey = COLOR_MAPPINGS[colorKey as keyof typeof COLOR_MAPPINGS];
      updated[colorKey] = getColor(brandColorKey);
    }
  });

  // Recursively update nested objects
  Object.keys(updated).forEach(key => {
    if (typeof updated[key] === 'object' && updated[key] !== null) {
      updated[key] = updateColorsInData(updated[key], getColor);
    }
  });

  return updated;
}

// Main Client Component wrapped with Brand Provider
function ClientContent({ isEdit }: { isEdit: boolean }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<SiteContent | null>(null);
  const [resolvedData, setResolvedData] = useState<SiteContent | null>(null);
  const [originalData, setOriginalData] = useState<SiteContent | null>(null);
  const [showBrandSidebar, setShowBrandSidebar] = useState<boolean>(false);
  const { sitePath } = useParams();
  const resolvedSitePath = Array.isArray(sitePath) ? sitePath.join("/") : sitePath || "";
  
  // Get brand context
  const { getColor, currentTheme } = useBrand();

  // Memoize the fetchSiteData function
  const fetchSiteData = useCallback(async () => {
    if (resolvedSitePath) {
      try {
        const response = await axios.get(`/api/site/${resolvedSitePath}/edit`);
        const fetchedData = response.data.content;
        setOriginalData(fetchedData); // Store original data
        setData(fetchedData);
        setResolvedData(fetchedData);
        console.log('Fetched data:', fetchedData);
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [resolvedSitePath]);

  // Apply brand colors to data when theme changes
  const applyBrandTheme = useCallback(() => {
    if (originalData) {
      const updatedData = updateColorsInData(originalData, getColor);
      setData(updatedData);
      setResolvedData(updatedData);
      console.log('Applied brand theme:', currentTheme.name, updatedData);
    }
  }, [originalData, getColor, currentTheme]);

  // Effect to fetch data on mount
  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  // Effect to apply theme when it changes
  useEffect(() => {
    if (originalData) {
      applyBrandTheme();
    }
  }, [applyBrandTheme]);

  // Memoize the onPublish handler
  const handlePublish = useCallback(
    async (publishData: SiteContent) => {
      try {
        console.log('Publishing data:', publishData);
        const response = await axios.put(`/api/site/${resolvedSitePath}`, {
          content: publishData,
        });
        
        // Update both original and current data
        setOriginalData(publishData);
        setData(response.data);
        setResolvedData(response.data);
        
        console.log('Published successfully');
      } catch (error) {
        console.error('Error updating site data:', error);
      }
    },
    [resolvedSitePath]
  );

  // Handle theme change and auto-publish
  const handleThemeChangeAndPublish = useCallback(async () => {
    if (data) {
      // Apply theme to current data
      const themedData = updateColorsInData(data, getColor);
      
      // Auto-publish the themed data
      await handlePublish(themedData);
      
      console.log('Theme applied and published automatically');
    }
  }, [data, getColor, handlePublish]);

  // Custom hook to detect theme changes
  useEffect(() => {
    // Skip on initial load
    if (originalData && data) {
      handleThemeChangeAndPublish();
    }
  }, [currentTheme.id]); // Trigger when theme ID changes

  if (isEdit && data) {
    return (
      <div>
        <Puck
          config={config}
          data={data}
          onPublish={handlePublish}
          plugins={[headingAnalyzer, createEmotionCachePlugin("puck-emotion-cache")]}
          headerPath={resolvedSitePath}
          overrides={{
            headerActions: ({ children }) => (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBrandSidebar(true)}
                    className='flex gap-2 font-semibold justify-center items-center bg-purple-600 text-white rounded-md h-[36px] px-4 text-[14px] hover:bg-purple-700 transition-colors'
                  >
                    <Palette className='w-4 h-4' /> Theme
                  </button>
                  <Link
                    href={`/site/${resolvedSitePath}`}
                    target='_blank'
                    className='flex gap-2 font-semibold justify-center items-center bg-white border text-black rounded-md h-[36px] px-4 text-[14px] hover:bg-gray-50 transition-colors'
                  >
                    <Eye className='w-5 h-5' /> View
                  </Link>
                </div>
                {children}
              </>
            ),
          }}
        />
        
        {/* Brand Sidebar */}
        <BrandSidebar 
          open={showBrandSidebar} 
          onClose={() => setShowBrandSidebar(false)} 
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

// Main Client Component with Brand Provider wrapper
export function Client({ isEdit }: { isEdit: boolean }) {
  return (
    <BrandProvider defaultTheme="modern">
      <ClientContent isEdit={isEdit} />
    </BrandProvider>
  );
}

export default Client;