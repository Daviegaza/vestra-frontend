import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  key: string;
  label: string;
  content?: ReactNode;
  count?: number;
  icon?: React.ComponentType<{ size?: number }>;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export default function Tabs({ tabs, defaultTab, onChange, variant = 'underline', className = '' }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);

  const handleChange = (key: string) => {
    setActive(key);
    onChange?.(key);
  };

  if (variant === 'pills') {
    return (
      <div>
        <div className={`flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleChange(tab.key)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  active === tab.key
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {active === tab.key && (
                  <motion.div
                    layoutId="tabPill"
                    className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                {Icon && <span className="relative z-10"><Icon size={14} /></span>}
                <span className="relative z-10">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`relative z-10 text-xs px-1.5 py-0.5 rounded-full ${active === tab.key ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="pt-4">
          {tabs.find((t) => t.key === active)?.content}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => handleChange(tab.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                active === tab.key
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {Icon && <Icon size={14} />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${active === tab.key ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
              {active === tab.key && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  );
}
