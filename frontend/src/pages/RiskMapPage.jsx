import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import RiskMap from '../components/RiskMap';
import api from '../services/api';
import LoadingState from '../components/LoadingState';
import { useLanguage } from '../context/LanguageContext';

export default function RiskMapPage() {
  const { t } = useLanguage();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    api.getRiskZones()
      .then((res) => {
        const list = Array.isArray(res) ? res : [];
        setZones(list);
        if (list.length > 0) setSelectedZone(list[0]);
      })
      .catch((err) => {
        console.error('Error fetching risk zones:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-115px)] flex flex-col">
        <div className="mb-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t('riskMap.pageTitle', 'North Eastern Region Risk Map')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {t('riskMap.pageSubtitle', 'AI-based landslide risk monitoring across the 8 North Eastern states')}
          </p>
        </div>

        <div className="flex-1 relative z-0 min-h-[350px]">
          {loading ? (
            <LoadingState message={t('loading.map', 'Loading map...')} />
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