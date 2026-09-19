import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading PRAHARI-NER data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500 h-full min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
