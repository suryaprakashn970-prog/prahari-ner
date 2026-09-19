import React, { useState } from 'react';
import api from '../services/api';
import { Calculator } from 'lucide-react';

export default function ManualPredictionForm() {
  const [formData, setFormData] = useState({
    rainfall_24h: 182,
    rainfall_72h: 320,
    soil_moisture: 78,
    slope: 36,
    elevation: 650,
    historical_landslide_count: 7
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.predictRisk(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-purple-500" />
        Manual XGBoost Prediction
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">24h Rainfall</label>
            <input type="number" name="rainfall_24h" value={formData.rainfall_24h} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">72h Rainfall</label>
            <input type="number" name="rainfall_72h" value={formData.rainfall_72h} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Soil Moisture</label>
            <input type="number" name="soil_moisture" value={formData.soil_moisture} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Slope</label>
            <input type="number" name="slope" value={formData.slope} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Elevation</label>
            <input type="number" name="elevation" value={formData.elevation} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Hist. Landslides</label>
            <input type="number" name="historical_landslide_count" value={formData.historical_landslide_count} onChange={handleChange} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-1.5 rounded text-sm hover:bg-purple-700 disabled:opacity-50">
          {loading ? 'Predicting...' : 'Run XGBoost Prediction'}
        </button>
      </form>

      {error && <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>}

      {result && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span className="font-bold text-gray-700">Prediction Result</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
              result.risk_level === 'CRITICAL' ? 'bg-red-500' :
              result.risk_level === 'HIGH' ? 'bg-orange-500' :
              result.risk_level === 'MODERATE' ? 'bg-yellow-500' : 'bg-green-500'
            }`}>{result.risk_level}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">Risk Score:</span>
            <span className="font-bold text-right">{result.risk_score} / 100</span>
            <span className="text-gray-600">Model:</span>
            <span className="font-mono text-xs text-right">{result.model} ({result.inference})</span>
            <span className="text-gray-600">Probability:</span>
            <span className="font-mono text-xs text-right">{result.risk_probability?.toFixed(4)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
