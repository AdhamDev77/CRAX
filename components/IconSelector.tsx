import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Search, ChevronDown } from 'lucide-react';

interface IconBrowserProps {
  value: {
    icon: keyof typeof Icons;
    size?: number;
    color?: string;
  };
  onChange: (value: { icon: keyof typeof Icons; size?: number; color?: string }) => void;
}

const IconBrowser = ({ value, onChange }: IconBrowserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const iconList = Object.keys(Icons).filter(
    (key) => 
      key !== 'default' && 
      typeof Icons[key] === 'function' &&
      key.toLowerCase().includes(search.toLowerCase())
  ) as Array<keyof typeof Icons>;

  const handleIconClick = (iconName: keyof typeof Icons) => {
    onChange({
      ...value,
      icon: iconName
    });
    setIsOpen(false);
  };

  const SelectedIcon = Icons[value.icon] as React.ComponentType<any>;

  return (
    <div className="w-full max-w-md">
      {/* Custom Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded">
            <SelectedIcon size={20} color={value.color} />
          </div>
          <span className="font-medium">{value.icon}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Icon Browser Panel */}
      <div className={`
        transition-all duration-200 overflow-hidden
        ${isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
      `}>
        <div className="border rounded-lg shadow-lg bg-white p-4">
          {/* Custom Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Icons Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[350px] overflow-y-auto p-2">
            {iconList.map((iconName) => {
              const IconComponent = Icons[iconName];
              return (
                <div
                  key={iconName}
                  onClick={() => handleIconClick(iconName)}
                  className={`
                    aspect-square p-2 rounded cursor-pointer
                    flex flex-col items-center justify-center gap-1
                    hover:bg-gray-50 transition-colors
                    ${value.icon === iconName ? 'bg-blue-50 ring-2 ring-blue-500' : ''}
                  `}
                >
                  <IconComponent 
                    size={24}
                    className={`
                      transition-colors
                      ${value.icon === iconName ? 'text-blue-500' : 'text-gray-600'}
                    `}
                  />
                  <span className="text-[10px] text-center text-gray-600 truncate w-full">
                    {iconName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* No Results Message */}
          {iconList.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No icons found matching "{search}"
            </div>
          )}

          {/* Icon Count */}
          <div className="text-xs text-gray-500 text-center mt-4 pb-2">
            {iconList.length} icons available
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconBrowser;