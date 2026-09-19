import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, Bell, FileText, AlertTriangle, Settings, Compass } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();

  const navItems = [
    { key: 'dashboard', name: t('navigation.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { key: 'riskMap', name: t('navigation.riskMap'), path: '/risk-map', icon: MapIcon },
    { key: 'alerts', name: t('navigation.alerts'), path: '/alerts', icon: Bell },
    { key: 'reports', name: t('navigation.fieldReports'), path: '/reports', icon: FileText },
    { key: 'response', name: t('navigation.response'), path: '/response', icon: AlertTriangle },
    { key: 'whatIf', name: t('navigation.whatIf', 'What-If'), path: '/what-if', icon: Compass },
    { key: 'settings', name: t('navigation.settings'), path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar sidebar */}
      <div className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-700 font-bold" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
