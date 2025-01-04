import React, { useState, useEffect } from 'react';
import { Radius, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface BorderRadiusProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESETS = [
  { name: 'Small', value: '4px' },
  { name: 'Medium', value: '8px' },
  { name: 'Large', value: '16px' },
  { name: 'Full', value: '50%' },
];

const getSteppedValue = (value: number) => {
  if (value <= 32) return value;
  if (value === 101) return 100; // For 50% case
  const remaining = value - 32;
  return 32 + (Math.round(remaining / 8) * 8);
};

const parseBorderRadius = (value: string = '0px') => {
  if (value.includes('%')) return 101; // Special value for 50%
  return parseInt(value) || 0;
};

const formatValue = (value: number) => {
  if (value === 101) return '50%';
  return `${value}px`;
};

const BorderRadiusAdjuster = ({ value = '8px', onChange }: BorderRadiusProps) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [radius, setRadius] = useState(parseBorderRadius(value));

  useEffect(() => {
    setRadius(parseBorderRadius(value));
  }, [value]);

  const updateRadius = (newRadius: number) => {
    const steppedValue = getSteppedValue(newRadius);
    setRadius(steppedValue);
    onChange(formatValue(steppedValue));
  };

  return (
    <Card className="w-full max-w-md bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radius size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Border Radius</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEnabled(!isEnabled)}
            className={`h-8 w-8 ${isEnabled ? "text-blue-600" : "text-gray-400"}`}
          >
            {isEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </Button>
        </div>

        <div className={isEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => updateRadius(parseBorderRadius(preset.value))}
                className="w-full text-sm"
              >
                {preset.name}
              </Button>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="w-24 h-24 bg-white border"
              style={{ borderRadius: formatValue(radius) }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Radius</label>
              <span className="text-xs text-gray-600">{formatValue(radius)}</span>
            </div>
            <Slider
              value={[radius]}
              onValueChange={([newRadius]) => updateRadius(newRadius)}
              min={1}
              max={32}
              step={1}
              className="py-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BorderRadiusAdjuster;