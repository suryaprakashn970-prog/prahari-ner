import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import AlertPanel from '../components/AlertPanel';
import api from '../services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlerts = () => {
    setLoading(true);
    setError('');
    api.getAlerts()
      .then((res) => {
        setAlerts(res || []);
      })
      .catch((err) => {
        console.error('Failed to load alerts:', err);
        setError('Unable to load alerts. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAlertUpdated = (updatedAlert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === updatedAlert.id ? { ...a, ...updatedAlert } : a))
    );
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Alerts</h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Real-time early warning advisories and landslide risk notifications
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAlerts}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-semibold text-gray-700">Loading alerts...</p>
            <p className="text-xs text-gray-400 mt-1">Retrieving latest sensor telemetry & risk notifications</p>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-red-700">{error}</p>
            <button
              onClick={fetchAlerts}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <AlertPanel alerts={alerts} onAlertUpdated={handleAlertUpdated} />
        )}
      </div>
    </PageLayout>
  );
}