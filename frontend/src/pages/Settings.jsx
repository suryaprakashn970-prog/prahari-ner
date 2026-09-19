import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';

export default function Settings() {
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    setDemoMode(localStorage.getItem('demo_mode') === 'true');
  }, []);

  const toggleDemoMode = () => {
    const newValue = !demoMode;
    setDemoMode(newValue);
    if (newValue) {
      localStorage.setItem('demo_mode', 'true');
    } else {
      localStorage.removeItem('demo_mode');
    }
    // Refresh to apply changes globally
    window.location.reload();
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-6">System Settings</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Demo Mode</h3>
              <p className="text-sm text-gray-500 mt-1">Bypass Firebase authentication and simulate local testing data.</p>
            </div>
            <button 
              onClick={toggleDemoMode}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                demoMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  demoMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
