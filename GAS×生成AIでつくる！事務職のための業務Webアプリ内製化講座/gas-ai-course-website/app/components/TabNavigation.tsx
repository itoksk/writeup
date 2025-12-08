'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  children: React.ReactNode[];
}

export default function TabNavigation({ tabs, children }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div>
      {/* タブヘッダー */}
      <div className="border-b-2 border-gray-200 mb-8">
        <nav className="flex gap-1 overflow-x-auto -mb-0.5" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-semibold text-sm whitespace-nowrap rounded-t-lg transition-all duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 border-b-2 border-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="animate-fadeIn">
        {children.map((child, index) => (
          <div
            key={tabs[index].id}
            className={activeTab === tabs[index].id ? 'block' : 'hidden'}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
