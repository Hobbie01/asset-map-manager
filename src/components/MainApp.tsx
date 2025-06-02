'use client';

import { useState } from 'react';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { PropertyOwners } from './PropertyOwners';
import { Properties } from './Properties';
import { ActivityLogs } from './ActivityLogs';

export const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'owners':
        return <PropertyOwners />;
      case 'properties':
        return <Properties />;
      case 'logs':
        return <ActivityLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};
