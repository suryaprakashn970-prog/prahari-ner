import React from 'react';
import { Cpu, Activity, Database, Info } from 'lucide-react';

export default function ModelStatus({ status }) {
  if (!status) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            XGBoost Risk Model
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {status.loaded ? (
              <span className="flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> MODEL LOADED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> MODEL NOT LOADED
              </span>
            )}
            {status.offline_capable && (
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                OFFLINE-CAPABLE
              </span>
            )}
          </div>
        </div>

        {status.loaded && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{status.inference} INFERENCE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">{status.features?.length || 0} FEATURES</span>
            </div>
            {status.metrics?.accuracy && (
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="font-medium">ACCURACY {(status.metrics.accuracy * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
