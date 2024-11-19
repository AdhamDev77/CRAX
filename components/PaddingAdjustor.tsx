import React, { useState, useEffect } from 'react';
import { Hand, X } from 'lucide-react';

interface PaddingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
  all: number;
}

interface PaddingAdjustorProps {
  value: string; // Now expects "10px 20px 10px 20px" format
  onChange: (value: string) => void;
  unit?: 'px' | '%';
}

const PaddingAdjustor = ({ value = '0px 0px 0px 0px', onChange, unit = 'px' }: PaddingAdjustorProps) => {
  const [activeSide, setActiveSide] = useState<'top' | 'right' | 'bottom' | 'left' | 'all' | null>(null);
  const [paddingValues, setPaddingValues] = useState<PaddingValue>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    all: 0
  });

  // Parse the input string value on component mount and value changes
  useEffect(() => {
    const values = value.split(' ').map(v => parseInt(v));
    if (values.length === 4) {
      setPaddingValues({
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[3],
        all: values.every(v => v === values[0]) ? values[0] : 0
      });
    }
    
  }, [value]);

  const handleInputChange = (side: keyof PaddingValue, newValue: string) => {
    const numValue = parseInt(newValue) || 0;
    let newPaddingValues: PaddingValue;

    if (side === 'all') {
      newPaddingValues = {
        top: numValue,
        right: numValue,
        bottom: numValue,
        left: numValue,
        all: numValue
      };
    } else {
      newPaddingValues = {
        ...paddingValues,
        [side]: numValue,
        all: 0
      };
    }

    setPaddingValues(newPaddingValues);

    
    // Convert to CSS string format
    const cssValue = `${newPaddingValues.top}${unit} ${newPaddingValues.right}${unit} ${newPaddingValues.bottom}${unit} ${newPaddingValues.left}${unit}`;
    onChange(cssValue);
  };

  const getSideValue = (side: keyof PaddingValue) => {
    return paddingValues[side] || 0;
  };

  const getPositionClasses = (side: string) => {
    switch (side) {
      case 'top': return 'top-4 left-1/2 -translate-x-1/2';
      case 'right': return 'right-2 top-1/2 -translate-y-1/2';
      case 'bottom': return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'left': return 'left-2 top-1/2 -translate-y-1/2';
      default: return '';
    }
  };

  return (
    <div className="w-full aspect-square relative">
      <h1 className='mb-2'>Padding</h1>
      <div className="w-full h-full bg-blue-50 rounded-lg shadow-lg relative flex items-center justify-center">
        {/* Center Area */}
        <div className="w-24 h-24 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer relative">
          {activeSide ? (
            <div className="absolute inset-0 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center space-y-2">
              <div className="text-sm font-medium text-gray-600 capitalize">
                {activeSide}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={getSideValue(activeSide)}
                  onChange={(e) => handleInputChange(activeSide, e.target.value)}
                  className="w-16 text-center bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 py-1"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setActiveSide(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center space-y-1"
              onClick={() => setActiveSide('all')}
            >
              <Hand className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-500">All sides</div>
              <div className="text-lg font-medium text-gray-700">
                {getSideValue('all')}{unit}
              </div>
            </div>
          )}
        </div>

        {/* Side Labels */}
        {['top', 'right', 'bottom', 'left'].map((side) => (
          <div
            key={side}
            className={`absolute ${getPositionClasses(side)} cursor-pointer`}
            onClick={() => setActiveSide(side as keyof PaddingValue)}
          >
            <div className="px-3 py-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
              <span className="text-blue-700 font-medium">
                {getSideValue(side as keyof PaddingValue)}
              </span>
            </div>
          </div>
        ))}

        {/* Corner Dots */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 right-0', 'bottom-0 left-0'].map((position) => (
          <div
            key={position}
            className={`absolute ${position} w-3 h-3 bg-blue-500 rounded-full`}
          />
        ))}
      </div>
    </div>
  );
};

export default PaddingAdjustor;