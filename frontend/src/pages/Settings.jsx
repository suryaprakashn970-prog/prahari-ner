import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { Shield, Bell, User, Cpu, Database } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [criticalSms, setCriticalSms] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">System Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account details, disaster alert channels, and monitoring preferences.
          </p>
        </div>

        {/* Authenticated Account Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Operator Profile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="block text-xs font-semibold text-gray-500 uppercase">Authenticated User</span>
              <span className="font-mono text-gray-800 font-medium">
                {user?.email || user?.phoneNumber || 'Disaster Response Operator'}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="block text-xs font-semibold text-gray-500 uppercase">Authentication Provider</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" /> Firebase Authentication
              </span>
            </div>
          </div>
        </div>

        {/* Disaster Warning Preferences */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Early Warning Alerts</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Critical Risk SMS Dispatch</p>
                <p className="text-xs text-gray-500">Automatically broadcast high-priority alerts to field personnel.</p>
              </div>
              <input
                type="checkbox"
                checked={criticalSms}
                onChange={(e) => setCriticalSms(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Real-Time Risk Threshold Alerts</p>
                <p className="text-xs text-gray-500">Trigger UI banners when rainfall exceeds 100mm/24h.</p>
              </div>
              <input
                type="checkbox"
                checked={highRiskAlerts}
                onChange={(e) => setHighRiskAlerts(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* System Intelligence Architecture */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Intelligence Engine Information</h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Landslide Prediction Model</span>
              <span className="font-semibold text-gray-800">XGBoost Classifier v1.0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Inference Engine</span>
              <span className="font-semibold text-gray-800">FastAPI Server-Side ML Pipeline</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">Target Region</span>
              <span className="font-semibold text-gray-800">North Eastern Region (NER), India</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">Offline Resilience</span>
              <span className="font-semibold text-emerald-700">Enabled (Cached Satellite & GIS Fallback)</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
