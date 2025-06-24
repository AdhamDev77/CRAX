import React from 'react';
import { Layers, Component, Layout, Brush, Text, Globe } from 'lucide-react';
import { cn } from '../../../../lib/utils';

const EditTabs = ({ editSection, setActiveEditSection, hasSelectedItem }: any) => {
  const globalTab = {
    id: 'global',
    label: 'Global',
    icon: Globe,
  };

  const contentStyleTabs = [
    {
      id: 'content',
      label: 'Content',
      icon: Text,
    },
    {
      id: 'style',
      label: 'Style',
      icon: Brush,
    },
  ];

  const handleTabChange = (tabId: any) => {
    setActiveEditSection(tabId); // Update the editSection prop directly
  };

  return (
    <div>
      {/* Global Tab */}
      {/* <div className="flex bg-white hover:bg-indigo-300 transition p-2 w-full border-b !rounded-[16px]">
        <nav className="flex gap-x-1 w-full" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
          <button
            key={globalTab.id}
            type="button"
            className={cn(
              'py-2 px-3 flex items-center justify-center gap-x-2',
              'text-[13px] font-medium rounded-lg flex-1',
              'transition-all duration-200',
              'focus:outline-none',
              'disabled:opacity-50 disabled:pointer-events-none',
              'hover:bg-white/80',
              editSection === globalTab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
            id={`tab-${globalTab.id}`}
            aria-selected={editSection === globalTab.id}
            aria-controls={`panel-${globalTab.id}`}
            role="tab"
            onClick={() => handleTabChange(globalTab.id)}
          >
            <Globe
              className={cn(
                'w-4 h-4',
                editSection === globalTab.id ? 'text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            />
            {globalTab.label}
          </button>
        </nav>
      </div> */}

      {/* Content and Style Tabs */}
      {hasSelectedItem && (<div className="flex bg-white hover:bg-indigo-300 transition p-2 w-full border-b !rounded-[16px]">
        <nav className="flex gap-x-1 w-full" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
          {contentStyleTabs.map((tab) => {
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
                  editSection === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
                id={`tab-${tab.id}`}
                aria-selected={editSection === tab.id}
                aria-controls={`panel-${tab.id}`}
                role="tab"
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon
                  className={cn(
                    'w-4 h-4',
                    editSection === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                  )}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>)}
      

      {/* Tab Panels */}
      <div className="mt-0">
        {[globalTab, ...contentStyleTabs].map((tab: any) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={editSection === tab.id ? '' : 'hidden'}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default EditTabs;