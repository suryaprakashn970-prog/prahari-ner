import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LoadingState({ message }) {
  const { t } = useLanguage();
  const displayMessage = message || t('loading.default', 'Loading PRAHARI-NER data...');

  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500 h-full min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
      <p className="text-sm font-medium text-gray-600">{displayMessage}</p>
    </div>
  );
}
