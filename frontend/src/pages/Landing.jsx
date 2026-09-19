import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Map, Activity, AlertTriangle, FileText, CheckCircle, PhoneCall } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <Shield className="w-20 h-20 text-blue-600 mb-6" />
      <h1 className="text-4xl font-bold mb-4 tracking-tight">PRAHARI-NER</h1>
      <h2 className="text-xl text-gray-600 mb-8 max-w-2xl font-light">
        AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region of India
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm font-medium text-gray-500 uppercase tracking-wider">
        <span className="flex items-center gap-1"><Activity className="w-4 h-4 text-blue-600"/> Monitor</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-blue-600"/> Predict</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Map className="w-4 h-4 text-blue-600"/> Map</span>
        <span>•</span>
        <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500"/> Alert</span>
        <span>•</span>
        <span className="flex items-center gap-1"><FileText className="w-4 h-4 text-blue-600"/> Verify</span>
        <span>•</span>
        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-600"/> Respond</span>
      </div>

      <div className="w-full max-w-xs mb-12">
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-lg font-semibold transition-colors shadow-md text-base"
        >
          Sign In / Access System
        </button>
      </div>

      {/* Emergency Contacts - Public and accessible without authentication */}
      <div className="w-full max-w-lg bg-gray-50 p-4 rounded-xl border border-gray-200">
        <p className="text-xs text-gray-600 uppercase tracking-wider font-bold mb-3">
          🚨 24x7 Emergency Helplines (No Login Required)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a
            href="tel:112"
            className="flex flex-col items-center justify-center p-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            <span className="text-xs">Emergency</span>
            <span className="text-lg font-black">112</span>
          </a>
          <a
            href="tel:108"
            className="flex flex-col items-center justify-center p-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <span className="text-xs">Ambulance</span>
            <span className="text-lg font-black">108</span>
          </a>
          <a
            href="tel:101"
            className="flex flex-col items-center justify-center p-2.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-sm"
          >
            <span className="text-xs">Fire</span>
            <span className="text-lg font-black">101</span>
          </a>
          <a
            href="tel:100"
            className="flex flex-col items-center justify-center p-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="text-xs">Police</span>
            <span className="text-lg font-black">100</span>
          </a>
        </div>
      </div>
    </div>
  );
}
