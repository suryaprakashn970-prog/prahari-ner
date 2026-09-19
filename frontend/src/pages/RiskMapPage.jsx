import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import RiskMap from '../components/RiskMap';
import api from '../services/api';
import LoadingState from '../components/LoadingState';

export default function RiskMapPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    api.getRiskZones()
      .then((res) => {
        setZones(res || []);
        if (res && res.length > 0) setSelectedZone(res[0]);
      })
      .catch((err) => {
        console.error('Error fetching risk zones:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-115px)] flex flex-col">
        <div className="mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            North Eastern Region Risk Map
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            AI-based landslide risk monitoring across the 8 North Eastern states
          </p>
        </div>

        <div className="flex-1 relative z-0 min-h-[350px]">
          {loading ? (
            <LoadingState />
          ) : (
            <RiskMap
              zones={zones}
              onSelectZone={setSelectedZone}
              selectedZone={selectedZone}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}