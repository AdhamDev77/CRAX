// components/FontSelector.tsx
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const fonts = [
  { name: "Inter", className: "font-inter", category: "Sans Serif" },
  { name: "Roboto", className: "font-roboto", category: "Sans Serif" },
  { name: "Open Sans", className: "font-open-sans", category: "Sans Serif" },
  { name: "Montserrat", className: "font-montserrat", category: "Sans Serif" },
  { name: "Lora", className: "font-lora", category: "Serif" },
  { name: "Playfair Display", className: "font-playfair", category: "Serif" },
  { name: "Merriweather", className: "font-merriweather", category: "Serif" },
  { name: "Source Code Pro", className: "font-source-code", category: "Monospace" },
  { name: "Fira Code", className: "font-fira-code", category: "Monospace" },
  { name: "Dancing Script", className: "font-dancing-script", category: "Handwriting" },
];

interface FontSelectorProps {
  selectedFont: string;
  onChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, onChange }) => {

  // If the selectedFont prop changes, update the local state
  const [internalFont, setInternalFont] = useState<string>(selectedFont);

  useEffect(() => {
    setInternalFont(selectedFont); // Sync local state with prop
  }, [selectedFont]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select onValueChange={(value) => {
          setInternalFont(value); // Update the local state
          onChange(value); // Notify parent component of the change
        }} value={internalFont}>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              fonts.reduce((acc, font) => {
                if (!acc[font.category]) acc[font.category] = [];
                acc[font.category].push(font);
                return acc;
              }, {} as Record<string, typeof fonts>)
            ).map(([category, categoryFonts]) => (
              <div key={category}>
                <Label className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {category}
                </Label>
                {categoryFonts.map((font) => (
                  <SelectItem key={font.name} value={font.className}>
                    <span className={font.className}>{font.name}</span>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={`space-y-2 ${internalFont} bg-stone-100 rounded text-center p-2`}>
        <p className="transition-all">
          The Font Looks Like This.
        </p>
      </div>
    </div>
  );
};

export default FontSelector;
