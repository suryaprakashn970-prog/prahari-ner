import React from 'react';
import { Database, Clock } from 'lucide-react';

export default function DataSourceStatus({ dataStatus }) {
  if (!dataStatus) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Database className="w-4 h-4 text-indigo-500" />
        Data Sources
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {Object.entries(dataStatus).map(([key, info]) => (
          <div key={key} className="flex-1 bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-xs font-bold text-gray-700 capitalize mb-1">{key.replace('_', ' ')}</div>
            <div className="flex justify-between items-end">
              <div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  info.mode === 'LIVE_PUBLIC' ? 'bg-green-200 text-green-800' :
                  info.mode === 'CACHED_PUBLIC' ? 'bg-blue-200 text-blue-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {info.mode.replace('_', ' ')}
                </span>
                <div className="text-xs text-gray-500 mt-1">{info.source}</div>
              </div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(info.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
