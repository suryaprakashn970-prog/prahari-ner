import React from 'react';
import { Map, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function RoadStatus({ roads }) {
  const { t } = useLanguage();

  const getStatusDisplay = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'OPEN':
        return t('roadStatus.open', 'OPEN');
      case 'BLOCKED':
        return t('roadStatus.blocked', 'BLOCKED');
      case 'AT RISK':
        return t('roadStatus.atRisk', 'AT RISK');
      case 'PARTIALLY BLOCKED':
        return t('roadStatus.partiallyBlocked', 'PARTIALLY BLOCKED');
      default:
        return status;
    }
  };

  if (!roads || roads.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
          {t('roadStatus.title', 'Road Status')}
        </h2>
        <div className="text-sm text-gray-500 text-center">
          {t('roadStatus.noRoadData', 'No road data available.')}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Map className="w-4 h-4 text-gray-600" />
        {t('roadStatus.title', 'Road Status')}
      </h2>
      
      <div className="flex flex-col gap-3">
        {roads.map(road => (
          <div key={road.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-800">{road.name}</span>
            <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded uppercase ${
              road.status === 'OPEN' ? 'bg-green-100 text-green-700' :
              road.status === 'BLOCKED' ? 'bg-red-100 text-red-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {road.status === 'OPEN' && <CheckCircle2 className="w-3 h-3" />}
              {road.status === 'BLOCKED' && <XCircle className="w-3 h-3" />}
              {road.status === 'AT RISK' && <AlertCircle className="w-3 h-3" />}
              {getStatusDisplay(road.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
