import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

type Unit = 'px' | 'rem' | '%';

export type Dimensions = {
  width: string;
  height: string;
};

interface DimensionControlProps {
  value?: Dimensions;
  onChange: (dimension: Dimensions) => void;
}

const defaultDimensions: Dimensions = {
  width: '100%',
  height: 'auto'
};

const parseValue = (value: string = '100%') => {
  const num = parseFloat(value) || 0;
  const unit = (value.match(/(px|rem|%)/) || ['%'])[0] as Unit;
  return { num, unit };
};

const formatValue = (num: number, unit: Unit) => `${num}${unit}`;

const DimensionAdjustor = ({ value = defaultDimensions, onChange }: DimensionControlProps) => {
  const initialWidth = value?.width || defaultDimensions.width;
  const initialHeight = value?.height || defaultDimensions.height;

  const [widthUnit, setWidthUnit] = useState<Unit>(() => parseValue(initialWidth).unit);
  const [heightUnit, setHeightUnit] = useState<Unit>(() => parseValue(initialHeight).unit);

  const handleDimensionChange = (
    dimension: 'width' | 'height',
    newValue: string,
    unit: Unit
  ) => {
    const numValue = parseFloat(newValue) || 0;
    const formattedValue = formatValue(numValue, unit);
    
    onChange({
      ...value,
      [dimension]: formattedValue
    });
  };

  const { num: widthNum } = parseValue(value.width);
  const { num: heightNum } = parseValue(value.height);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Ruler className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Dimensions</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 w-12">Width</label>
          <div className="flex-1 flex gap-2">
            <input
              type="number"
              value={widthNum}
              onChange={(e) => handleDimensionChange('width', e.target.value, widthUnit)}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={widthUnit}
              onChange={(e) => {
                const newUnit = e.target.value as Unit;
                setWidthUnit(newUnit);
                handleDimensionChange('width', widthNum.toString(), newUnit);
              }}
              className="px-1 text-sm border rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 w-12">Height</label>
          <div className="flex-1 flex gap-2">
            <input
              type="number"
              value={heightNum}
              onChange={(e) => handleDimensionChange('height', e.target.value, heightUnit)}
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={heightUnit}
              onChange={(e) => {
                const newUnit = e.target.value as Unit;
                setHeightUnit(newUnit);
                handleDimensionChange('height', heightNum.toString(), newUnit);
              }}
              className="px-1 text-sm border rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionAdjustor;