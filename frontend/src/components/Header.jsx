import React from 'react';
import { Shield, Menu, User, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ toggleSidebar, dataStatus }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Shield className="w-8 h-8 text-blue-600 hidden sm:block" />
          <span className="font-bold text-xl tracking-tight text-gray-900">
            {t('common.appName', 'PRAHARI-NER')}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Header Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-gray-400 ml-1.5 hidden sm:block" />
            <button
              type="button"
              onClick={() => setSelectedLanguage('en')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${
                selectedLanguage === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${
                selectedLanguage === 'hi'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">
              {dataStatus?.status === 'error' ? t('common.systemOffline') : t('common.systemOnline')}
            </span>
            <span className="sm:hidden">
              {dataStatus?.status === 'error' ? t('common.offline') : t('common.online')}
            </span>
          </span>

          {user && (
            <div className="hidden md:flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span className="max-w-[150px] truncate">{user.email || user.phoneNumber || t('common.authenticatedUser')}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('navigation.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
