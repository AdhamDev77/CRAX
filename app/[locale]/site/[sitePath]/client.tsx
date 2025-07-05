"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Puck, Render } from "../../../../packages/core";
import headingAnalyzer from "../../../../packages/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../../../config";
import { useParams } from 'next/navigation';
import { Data } from '@measured/puck';
import { Link } from '@/i18n/routing';
import { Eye, Palette } from 'lucide-react';
import BuilderLoader from '@/components/BuilderLoader';
import { BrandProvider, BrandSidebar, useBrand } from '@/packages/core/components/Puck/components/BrandSidebar'; // Adjust import path

interface SiteData {
  content: Data;
  metaTitle: string;
  metaDescription: string;
  metaIcon: string;
}

// Color mapping for automatic theme application
const COLOR_MAPPINGS = {
  bgColor: 'background',
  backgroundColor: 'background',
  primaryColor: 'primary',
  secondaryColor: 'secondary',
  accentColor: 'accent',
  fontColor: 'primary',
  textColor: 'primary',
  borderColor: 'secondary',
} as const;

// Font mapping for automatic theme application
const FONT_MAPPINGS = {
  headingFont: 'heading',
  titleFont: 'heading',
  h1Font: 'heading',
  h2Font: 'heading',
  h3Font: 'heading',
  h4Font: 'heading',
  h5Font: 'heading',
  h6Font: 'heading',
  bodyFont: 'body',
  textFont: 'body',
  paragraphFont: 'body',
  contentFont: 'body',
  font: 'body',
  fontFamily: 'body',
} as const;

// Function to apply theme colors and fonts to HTML text content
function applyThemeToHtmlText(
  htmlText: string,
  type: string,
  getColor: (colorName: string) => string,
  getFont: (fontType: string) => string
): string {
  if (!htmlText || typeof htmlText !== 'string') return htmlText;

  // Determine theme colors and fonts based on type
  const themeColor = type === 'heading' ? getColor('primary') : getColor('secondary');
  const themeFont = type === 'heading' ? getFont('heading') : getFont('body');

  // Replace existing color styles with theme color
  let updatedHtml = htmlText.replace(
    /color:\s*[^;]+;?/gi,
    `color: ${themeColor};`
  );

  // Replace existing font-family styles with theme font
  updatedHtml = updatedHtml.replace(
    /font-family:\s*[^;]+;?/gi,
    `font-family: ${themeFont};`
  );

  // Add theme color if no color style exists
  if (!/color:\s*/i.test(updatedHtml)) {
    updatedHtml = updatedHtml.replace(
      /(<[^>]*style\s*=\s*"[^"]*?)(")/gi,
      `$1; color: ${themeColor};$2`
    );
    
    // If no style attribute exists at all, add one to span elements
    if (!/style\s*=/i.test(updatedHtml)) {
      updatedHtml = updatedHtml.replace(
        /<span(?![^>]*style)/gi,
        `<span style="color: ${themeColor}; font-family: ${themeFont};"`
      );
    }
  }

  // Add theme font if no font-family style exists
  if (!/font-family:\s*/i.test(updatedHtml)) {
    updatedHtml = updatedHtml.replace(
      /(<[^>]*style\s*=\s*"[^"]*?)(")/gi,
      `$1; font-family: ${themeFont};$2`
    );
  }

  return updatedHtml;
}

// Function to apply theme colors and fonts to data recursively
function applyThemeToData(
  data: any, 
  getColor: (colorName: string) => string,
  getFont: (fontType: string) => string
): any {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(item => applyThemeToData(item, getColor, getFont));
  }

  const result: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      result[key] = applyThemeToData(value, getColor, getFont);
    } else if (typeof value === 'string') {
      // Handle text property with HTML content based on type
      if (key === 'text' && data.type && (data.type === 'heading' || data.type === 'body')) {
        result[key] = applyThemeToHtmlText(value, data.type, getColor, getFont);
      }
      // Apply theme color if this is a color property
      else if (key in COLOR_MAPPINGS) {
        const colorType = COLOR_MAPPINGS[key as keyof typeof COLOR_MAPPINGS];
        result[key] = getColor(colorType);
      }
      // Apply theme font if this is a font property
      else if (key in FONT_MAPPINGS) {
        const fontType = FONT_MAPPINGS[key as keyof typeof FONT_MAPPINGS];
        result[key] = getFont(fontType);
      }
      // Keep original value for non-theme properties
      else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Inner component that has access to brand context
function ClientInner({ isEdit }: { isEdit: boolean }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [originalData, setOriginalData] = useState<SiteData | null>(null);
  const [isBrandSidebarOpen, setIsBrandSidebarOpen] = useState(false);
  const [hasThemeChanged, setHasThemeChanged] = useState(false);
  const { sitePath } = useParams();
  const resolvedSitePath = Array.isArray(sitePath) ? sitePath.join("/") : sitePath || "";
  
  const { currentTheme, getColor, getFont } = useBrand();

  // Fetch site data
  useEffect(() => {
    async function fetchSiteData() {
      if (!resolvedSitePath) return;

      try {
        const response = await fetch(`/api/site/${resolvedSitePath}`);
        if (!response.ok) throw new Error('Failed to fetch site data');
        const data = await response.json();
        setSiteData(data);
        setOriginalData(data); // Store original data
        console.log(data);
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSiteData();
  }, [resolvedSitePath]);

  // Track the previous theme to detect actual changes
  const [previousThemeId, setPreviousThemeId] = useState<string | null>(null);

  // Apply theme changes when theme actually changes
  useEffect(() => {
    if (!originalData || !currentTheme) return;
    
    // Only apply theme if this is an actual theme change, not initial load
    if (previousThemeId !== null && previousThemeId !== currentTheme.id) {
      const themedData = {
        ...originalData,
        content: applyThemeToData(originalData.content, getColor, getFont)
      };

      setSiteData(themedData);
      setHasThemeChanged(true);
    }
    
    // Update the previous theme ID
    setPreviousThemeId(currentTheme.id);
  }, [currentTheme.id, originalData, getColor, getFont, previousThemeId]);

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

  // Auto-save and publish when theme changes (with debounce)
  const autoSaveThemedSite = useCallback(async () => {
    if (!hasThemeChanged || !siteData) return;

    try {
      const response = await fetch(`/api/site/${resolvedSitePath}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: siteData.content }),
      });
      
      if (!response.ok) throw new Error('Failed to auto-save themed site');
      
      // Update original data to reflect the new themed version
      setOriginalData(siteData);
      setHasThemeChanged(false);
      
      console.log('Themed site auto-saved successfully');
      
      // Force a re-render instead of full page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error auto-saving themed site:', error);
      setHasThemeChanged(false); // Reset state even on error
    }
  }, [hasThemeChanged, siteData, resolvedSitePath]);

  // Trigger auto-save when theme changes (with debounce)
  useEffect(() => {
    if (!hasThemeChanged) return;
    
    const timeoutId = setTimeout(() => {
      autoSaveThemedSite();
    }, 2000); // 2 second delay to allow for multiple rapid theme changes

    return () => clearTimeout(timeoutId);
  }, [hasThemeChanged, autoSaveThemedSite]);

  // Handle manual publishing (when no theme change)
  const handlePublish = useMemo(() => async (publishData: Data) => {
    try {
      const response = await fetch(`/api/site/${resolvedSitePath}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: publishData }),
      });
      if (!response.ok) throw new Error('Failed to update site data');
      setSiteData((prev) => prev ? { ...prev, content: publishData } : null);
      setOriginalData((prev) => prev ? { ...prev, content: publishData } : null);
    } catch (error) {
      console.error('Error updating site data:', error);
    }
  }, [resolvedSitePath]);

  const handleCloseBrandSidebar = () => {
    setIsBrandSidebarOpen(false);
  };

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
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsBrandSidebarOpen(true)}
                    className='flex gap-2 font-semibold justify-center items-center bg-purple-600 hover:bg-purple-700 border text-white rounded-md h-[36px] px-4 text-[14px] transition-colors'
                  >
                    <Palette className='w-5 h-5' /> Theme
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
        
        <BrandSidebar 
          open={isBrandSidebarOpen} 
          onClose={handleCloseBrandSidebar}
        />
        
        {hasThemeChanged && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving theme changes...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <Render config={config} data={siteData.content} />;
}

// Main Client component wrapped with BrandProvider
export function Client({ isEdit }: { isEdit: boolean }) {
  return (
    <BrandProvider defaultTheme="modern">
      <ClientInner isEdit={isEdit} />
    </BrandProvider>
  );
}

export default Client;