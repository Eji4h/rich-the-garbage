import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Gallery from './Gallery';
import Videos from './Videos';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'gallery' | 'videos';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

const tabs: TabConfig[] = [
  {
    id: 'gallery',
    label: 'Gallery',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    ),
    component: Gallery,
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
    component: Videos,
  },
];

interface TabButtonProps {
  readonly tab: TabConfig;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

function TabButton({ tab, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300',
        isActive ? 'text-purple-700' : 'text-slate-600 hover:text-slate-900',
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        {tab.icon}
        {tab.label}
      </span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-full shadow-md"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

export default function GalleryTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('gallery');
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component ?? Gallery;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full p-2 shadow-lg ring-1 ring-white/50">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
