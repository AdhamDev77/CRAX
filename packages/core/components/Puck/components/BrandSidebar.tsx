'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Simplified Brand Theme Definition
interface BrandTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// Brand Themes with 4 colors and 2 fonts only
const brandThemes: Record<string, BrandTheme> = {
  modern: {
    id: 'modern',
    name: 'Modern Tech',
    colors: {
      primary: '#3B82F6',
      secondary: '#1F2937',
      accent: '#F59E0B',
      background: '#FFFFFF',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    }
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant Luxury',
    colors: {
      primary: '#1F2937',
      secondary: '#D4AF37',
      accent: '#B91C1C',
      background: '#FEFEFE',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Source Sans Pro, sans-serif'
    }
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant Creative',
    colors: {
      primary: '#EC4899',
      secondary: '#06B6D4',
      accent: '#10B981',
      background: '#FFFFFF',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif'
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#4F46E5',
      background: '#FFFFFF',
    },
    fonts: {
      heading: 'Helvetica Neue, sans-serif',
      body: 'Helvetica Neue, sans-serif'
    }
  },
  nature: {
    id: 'nature',
    name: 'Nature Organic',
    colors: {
      primary: '#059669',
      secondary: '#92400E',
      accent: '#DC2626',
      background: '#F9FDF9',
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Lato, sans-serif'
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark Professional',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      accent: '#F472B6',
      background: '#0F172A',
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif',
      body: 'Inter, sans-serif'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Warm',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      accent: '#FFD23F',
      background: '#FFF8F0',
    },
    fonts: {
      heading: 'Nunito Sans, sans-serif',
      body: 'Nunito, sans-serif'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#06B6D4',
      background: '#F0F9FF',
    },
    fonts: {
      heading: 'Roboto, sans-serif',
      body: 'Open Sans, sans-serif'
    }
  }
};

// Brand Context
interface BrandContextType {
  currentTheme: BrandTheme;
  themes: Record<string, BrandTheme>;
  setTheme: (themeId: string) => void;
  getColor: (colorName: keyof BrandTheme['colors']) => string;
  getFont: (fontType: keyof BrandTheme['fonts']) => string;
  onThemeChange?: (themeId: string) => void;
}

const BrandContext = createContext<BrandContextType | null>(null);

// Helper function to get stored theme
const getStoredTheme = (defaultTheme: string): string => {
  if (typeof window === 'undefined') return defaultTheme;
  
  try {
    const stored = window.sessionStorage?.getItem('brandTheme');
    return stored && brandThemes[stored] ? stored : defaultTheme;
  } catch {
    return defaultTheme;
  }
};

// Helper function to store theme
const storeTheme = (themeId: string) => {
  if (typeof window === 'undefined') return;
  
  try {
    window.sessionStorage?.setItem('brandTheme', themeId);
  } catch {
    // Silently fail if storage is not available
  }
};

// Brand Provider Component
export const BrandProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: string;
  onThemeChange?: (themeId: string) => void;
}> = ({ children, defaultTheme = 'modern', onThemeChange }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => getStoredTheme(defaultTheme));
  
  const currentTheme = brandThemes[currentThemeId];
  
  const setTheme = (themeId: string) => {
    if (brandThemes[themeId]) {
      setCurrentThemeId(themeId);
      storeTheme(themeId);
      onThemeChange?.(themeId);
    }
  };

  // Load stored theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme(defaultTheme);
    if (storedTheme !== currentThemeId) {
      setCurrentThemeId(storedTheme);
    }
  }, [defaultTheme, currentThemeId]);

  const getColor = (colorName: keyof BrandTheme['colors']): string => {
    return currentTheme?.colors[colorName] || '#000000';
  };

  const getFont = (fontType: keyof BrandTheme['fonts']): string => {
    return currentTheme?.fonts[fontType] || 'sans-serif';
  };
  
  const contextValue: BrandContextType = {
    currentTheme,
    themes: brandThemes,
    setTheme,
    getColor,
    getFont,
    onThemeChange
  };
  
  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  );
};

// Hook to use brand system
export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
};

// Enhanced Brand Selector Component
const BrandSelector: React.FC = () => {
  const { currentTheme, themes, setTheme } = useBrand();
  const [isChanging, setIsChanging] = useState(false);
  
  const handleThemeChange = async (themeId: string) => {
    setIsChanging(true);
    setTheme(themeId);
    
    // Add a small delay to show the changing state
    setTimeout(() => {
      setIsChanging(false);
    }, 500);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Choose Site Theme</h3>
        {isChanging && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            Applying...
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.values(themes).map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            disabled={isChanging}
            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentTheme.id === theme.id 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex gap-1 mb-2">
              <div 
                className="w-6 h-6 rounded" 
                style={{ backgroundColor: theme.colors.primary }}
                title="Primary Color"
              />
              <div 
                className="w-6 h-6 rounded" 
                style={{ backgroundColor: theme.colors.secondary }}
                title="Secondary Color"
              />
              <div 
                className="w-6 h-6 rounded" 
                style={{ backgroundColor: theme.colors.accent }}
                title="Accent Color"
              />
              <div 
                className="w-6 h-6 rounded border" 
                style={{ backgroundColor: theme.colors.background }}
                title="Background Color"
              />
            </div>
            <div className="text-sm font-medium">{theme.name}</div>
            {currentTheme.id === theme.id && (
              <div className="text-xs text-blue-600 mt-1">Current</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Brand Preview Component
const BrandPreview: React.FC = () => {
  const { getColor, getFont, currentTheme } = useBrand();
  
  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-semibold">Live Preview</h4>
      
      {/* Color Palette */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-600">Color Palette</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border" 
              style={{ backgroundColor: getColor('primary') }}
            />
            <span>Primary: {currentTheme.colors.primary}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border" 
              style={{ backgroundColor: getColor('secondary') }}
            />
            <span>Secondary: {currentTheme.colors.secondary}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border" 
              style={{ backgroundColor: getColor('accent') }}
            />
            <span>Accent: {currentTheme.colors.accent}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300" 
              style={{ backgroundColor: getColor('background') }}
            />
            <span>Background: {currentTheme.colors.background}</span>
          </div>
        </div>
      </div>
      
      {/* Typography */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-600">Typography</h5>
        <div className="text-xs space-y-1">
          <div>Heading: {currentTheme.fonts.heading}</div>
          <div>Body: {currentTheme.fonts.body}</div>
        </div>
      </div>
      
      {/* Live Preview */}
      <div 
        className="p-6 rounded-lg border transition-all duration-300"
        style={{ backgroundColor: getColor('background') }}
      >
        <h1 
          className="text-2xl font-bold mb-2 transition-all duration-300"
          style={{ color: getColor('primary'), fontFamily: getFont('heading') }}
        >
          Main Heading
        </h1>
        <h2 
          className="text-xl mb-3 transition-all duration-300"
          style={{ color: getColor('secondary'), fontFamily: getFont('heading') }}
        >
          Secondary Heading
        </h2>
        <p 
          className="mb-4 transition-all duration-300"
          style={{ color: getColor('secondary'), fontFamily: getFont('body') }}
        >
          This is body text using the brand&apos;s typography. It demonstrates how the text will appear in your application with the selected brand identity.
        </p>
        <div className="flex gap-3">
          <button 
            className="px-4 py-2 rounded text-white font-medium transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: getColor('primary'), fontFamily: getFont('body') }}
          >
            Primary Button
          </button>
          <button 
            className="px-4 py-2 rounded text-white font-medium transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: getColor('accent'), fontFamily: getFont('body') }}
          >
            Accent Button
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar overlay component
export const BrandSidebar: React.FC<{ 
  open: boolean; 
  onClose: () => void;
}> = ({ open, onClose }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Sidebar */}
      <div className="relative ml-auto w-[400px] max-w-full h-full bg-white shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Site Design</h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <BrandSelector />
          <BrandPreview />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Theme changes are automatically applied and saved to your site.
          </p>
        </div>
      </div>
    </div>
  );
};