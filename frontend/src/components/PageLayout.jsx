import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function PageLayout({ children, dataStatus }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <Header toggleSidebar={() => setSidebarOpen(true)} dataStatus={dataStatus} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
