'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Layout from './components/Layout';
import CreateSnippet from './components/CreateSnippet';
import RetrieveSnippet from './components/RetrieveSnippet';
import { FiPlus, FiSearch } from 'react-icons/fi';

function TabContainer() {
  const [activeTab, setActiveTab] = useState<'create' | 'retrieve'>('create');
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams?.get('code');
    if (code) {
      setActiveTab('retrieve');
    }
  }, [searchParams]);

  return (
    <>
      <div className="my-6">
        <div className="hidden sm:block">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <TabButton
                isActive={activeTab === 'create'}
                onClick={() => setActiveTab('create')}
                icon={<FiPlus className="mr-2" />}
                label="Create"
              />
              <TabButton
                isActive={activeTab === 'retrieve'}
                onClick={() => setActiveTab('retrieve')}
                icon={<FiSearch className="mr-2" />}
                label="Retrieve"
              />
            </nav>
          </div>
        </div>

        <div className="sm:hidden">
          <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
            <MobileTabButton
              isActive={activeTab === 'create'}
              onClick={() => setActiveTab('create')}
              icon={<FiPlus className="mr-2" />}
              label="Create"
            />
            <MobileTabButton
              isActive={activeTab === 'retrieve'}
              onClick={() => setActiveTab('retrieve')}
              icon={<FiSearch className="mr-2" />}
              label="Retrieve"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'create' ? <CreateSnippet /> : <RetrieveSnippet />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <TabContainer />
      </Suspense>
    </Layout>
  );
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`${isActive
      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
      } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium transition-colors duration-200`}
  >
    {icon}
    {label}
  </button>
);

const MobileTabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`${isActive
      ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800'
      : 'bg-white text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
      } flex items-center justify-center py-2 px-3 border rounded-md font-medium transition-colors duration-200`}
  >
    {icon}
    {label}
  </button>
);