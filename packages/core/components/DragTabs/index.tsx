import React, { useState } from 'react';
import { Layers, Component, Layout } from 'lucide-react';
import { cn } from '../../../../lib/utils';

const DragTabs = ({ activeComponent, setActiveComponent }: any) => {
  const [activeTab, setActiveTab] = useState<any>(activeComponent || 'elements');

  const tabs = [
    {
      id: 'elements',
      label: 'Elements',
      icon: Layers,
    },
    {
      id: 'components',
      label: 'Components',
      icon: Component,
    },
    {
      id: 'sections',
      label: 'Sections',
      icon: Layout,
    },
  ];

  const handleTabChange = (tabId: any) => {
    setActiveTab(tabId);
    setActiveComponent(tabId);
  };

  return (
    <div>
      <div className="flex">
        <div className="flex bg-white hover:bg-indigo-300 transition p-2 w-full border-b !rounded-[16px]">
          <nav
            className="flex gap-x-1 w-full"
            aria-label="Tabs"
            role="tablist"
            aria-orientation="horizontal"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={cn(
                    'py-2 px-3 flex items-center justify-center gap-x-2',
                    'text-[13px] font-medium rounded-lg flex-1',
                    'transition-all duration-200',
                    'focus:outline-none',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'hover:bg-white/80',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                  id={`tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  role="tab"
                  onClick={() => handleTabChange(tab.id)}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-0">
        {tabs.map((tab: any) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? '' : 'hidden'}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DragTabs;