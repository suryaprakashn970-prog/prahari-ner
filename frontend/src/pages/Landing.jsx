import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Map, Activity, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <Shield className="w-20 h-20 text-blue-600 mb-6" />
      <h1 className="text-4xl font-bold mb-4 tracking-tight">PRAHARI-NER</h1>
      <h2 className="text-xl text-gray-600 mb-8 max-w-2xl font-light">
        AI-Based Early Warning & Landslide Risk Monitoring System
      </h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm font-medium text-gray-500 uppercase tracking-wider">
        <span className="flex items-center gap-1"><Activity className="w-4 h-4"/> Monitor</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Shield className="w-4 h-4"/> Predict</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Map className="w-4 h-4"/> Map</span>
        <span>•</span>
        <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> Alert</span>
        <span>•</span>
        <span className="flex items-center gap-1"><FileText className="w-4 h-4"/> Verify</span>
        <span>•</span>
        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Respond</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={() => navigate('/login')}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Access Dashboard
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          Explore Demo
        </button>
      </div>
    </div>
  );
}
