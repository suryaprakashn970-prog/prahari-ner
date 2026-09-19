import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
      <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
      <p className="text-sm font-medium text-gray-900 mb-2">Something went wrong</p>
      <p className="text-xs text-gray-500 mb-4 max-w-sm">{error || "Failed to load data."}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 text-gray-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
