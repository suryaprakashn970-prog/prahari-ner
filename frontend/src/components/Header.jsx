import React, { useEffect, useState } from 'react';
import { Shield, Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

export default function Header({ toggleSidebar, dataStatus }) {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('demo_mode') === 'true') {
      setIsDemo(true);
    }
  }, []);

  const handleLogout = async () => {
    if (auth && !isDemo) {
      await auth.signOut();
    }
    localStorage.removeItem('demo_mode');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <Shield className="w-8 h-8 text-blue-600 hidden sm:block" />
          <span className="font-bold text-xl tracking-tight text-gray-900">
            PRAHARI-NER
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {isDemo ? (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200">
              DEMO MODE
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded border border-green-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> ONLINE
            </span>
          )}
          
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
