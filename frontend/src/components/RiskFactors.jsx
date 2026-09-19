import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

export default function RiskFactors({ zone }) {
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!zone) return;
    
    const fetchFactors = async () => {
      setLoading(true);
      try {
        const res = await api.predictRisk({
          rainfall_24h: zone.rainfall_24h,
          rainfall_72h: zone.rainfall_72h,
          soil_moisture: zone.soil_moisture,
          slope: zone.slope,
          elevation: zone.elevation,
          historical_landslide_count: zone.historical_landslide_count
        });
        
        setFactors(res.explanation || res.factors || []);
      } catch (err) {
        console.error("Failed to fetch model explanation", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFactors();
  }, [zone]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Model Factors</h2>
      
      {loading ? (
        <div className="flex justify-center p-4 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : factors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {factors.map((f, i) => (
            <div key={i} className="p-3 border border-gray-100 rounded-md bg-gray-50">
              <div className="text-xs text-gray-500 font-medium uppercase mb-1">{f.feature.replace(/_/g, ' ')}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{f.value}</div>
              <div className={`text-xs font-bold ${
                f.interpretation.includes('HIGH') ? 'text-red-600' :
                f.interpretation.includes('MODERATE') ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {f.interpretation}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-4 text-center">No explanation available for this zone.</div>
      )}
    </div>
  );
}
