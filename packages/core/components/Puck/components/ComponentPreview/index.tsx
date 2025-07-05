import { useState, useEffect, useMemo } from 'react';
import { Render } from "../../../../index";
import { useAppContext } from "../../context";
import { useBrand } from '../BrandSidebar';

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

interface ComponentPreviewProps {
  comp: any;
  designWidth?: number;
}

export const ComponentPreview = ({
  comp,
  designWidth = 1200
}: ComponentPreviewProps) => {
  const { config } = useAppContext();
  const { currentTheme, getColor, getFont } = useBrand();

  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [previewRef, setPreviewRef] = useState<HTMLDivElement | null>(null);
  const [calculatedHeight, setCalculatedHeight] = useState<number | null>(null);
  const [calculatedScale, setCalculatedScale] = useState<number | null>(null);

  // Apply theme to component data
  const themedComponentData = useMemo(() => {
    if (!comp || !currentTheme) return comp;

    const themedComp = {
      ...comp,
      content: comp.content ? applyThemeToData(comp.content, getColor, getFont) : comp.content,
      zones: comp.zones ? applyThemeToData(comp.zones, getColor, getFont) : comp.zones
    };

    return themedComp;
  }, [comp, currentTheme, getColor, getFont]);

  // Create a data structure for the component preview
  const previewData = useMemo(() => ({
    content: themedComponentData.content ? [themedComponentData.content] : [],
    zones: themedComponentData.zones || {},
    root: { props: {} }
  }), [themedComponentData]);

  // Calculate height and scale
  useEffect(() => {
    if (
      previewRef &&
      containerRef &&
      previewRef.scrollHeight > 0 &&
      containerRef.offsetWidth > 0
    ) {
      const containerWidth = containerRef.offsetWidth;
      const scale = containerWidth / designWidth;
      const previewHeight = previewRef.scrollHeight;
      const scaledHeight = previewHeight * scale;

      setCalculatedScale(scale);
      setCalculatedHeight(scaledHeight);
    }
  }, [previewRef, containerRef, designWidth]);

  const finalScale = calculatedScale || 300 / designWidth;
  const finalHeight = calculatedHeight || "auto";

  return (
    <div className="w-full">
      <div
        ref={setContainerRef}
        className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 relative"
        style={{
          width: "100%",
          height: finalHeight,
        }}
      >
        <div
          ref={setPreviewRef}
          className="absolute top-0 left-0"
          style={{
            transform: `scale(${finalScale})`,
            transformOrigin: "top left",
            width: designWidth,
            height: "fit-content",
          }}
        >
          <Render
            config={config}
            data={previewData}
          />
        </div>

        {!calculatedHeight && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};


// Export the theme helper functions for use in other components
export { applyThemeToData, applyThemeToHtmlText, COLOR_MAPPINGS, FONT_MAPPINGS };