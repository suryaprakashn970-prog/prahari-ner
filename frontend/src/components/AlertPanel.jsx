import React from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';

export default function AlertPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Active Alerts</h2>
        <div className="text-sm text-gray-500 p-4 text-center">No active alerts at this time.</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        Active Alerts ({alerts.length})
      </h2>
      
      <div className="flex flex-col gap-3">
        {alerts.map(alert => (
          <div key={alert.id} className={`p-3 rounded-lg border border-l-4 ${
            alert.risk_level === 'CRITICAL' ? 'border-red-200 border-l-red-500 bg-red-50' : 
            'border-orange-200 border-l-orange-500 bg-orange-50'
          }`}>
            <div className="flex justify-between items-start mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                alert.risk_level === 'CRITICAL' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
              }`}>
                {alert.risk_level}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(alert.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-sm text-gray-800 font-medium mt-2">{alert.message}</p>
            
            <div className="flex gap-2 mt-3">
              <button className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 font-medium">
                View
              </button>
              <button className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 font-medium">
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
