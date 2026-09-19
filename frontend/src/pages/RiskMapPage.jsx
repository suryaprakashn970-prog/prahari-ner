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
      .then(res => {
        setZones(res);
        if (res.length > 0) setSelectedZone(res[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-120px)] flex flex-col">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Regional Risk Map</h1>
        <div className="flex-1 relative z-0">
          {loading ? <LoadingState /> : <RiskMap zones={zones} onSelectZone={setSelectedZone} selectedZone={selectedZone} />}
        </div>
      </div>
    </PageLayout>
  );
}
