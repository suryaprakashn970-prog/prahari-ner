import React from 'react';
import { Route, Home, Building2, Ambulance, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatIfImpactCards({ analysis }) {
  const { t } = useLanguage();

  if (!analysis) return null;

  const { road_impact, settlements, critical_infrastructure, emergency_access } = analysis;

  const getRoadBadgeClass = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'AT RISK':
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
        <span>{t('whatIf.potentialImpact', 'Potential Impact')}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Road Access */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Route className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  {t('whatIf.roadAccess', 'Road Access')}
                </h4>
              </div>
              {road_impact?.available ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  {road_impact.roads?.length || 0} {t('whatIf.roadsIdentified', 'Roads Identified')}
                </span>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                  {t('whatIf.roadDataUnavailable', 'Road data unavailable')}
                </span>
              )}
            </div>

            <div className="mt-3">
              {road_impact?.available && road_impact.roads?.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-medium">
                    {t('whatIf.availableRoadInfo', 'Available road information:')}
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {road_impact.roads.map((road, idx) => (
                      <div
                        key={road.id || idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                      >
                        <div className="font-semibold text-gray-900">
                          {road.name}
                          {road.distance_km !== null && road.distance_km !== undefined && (
                            <span className="text-gray-600 ml-1.5 font-normal">
                              (~{road.distance_km} km)
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getRoadBadgeClass(
                            road.status
                          )}`}
                        >
                          {road.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{t('whatIf.roadDataUnavailable', 'Road data unavailable')}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
            {t('whatIf.basedOnAvailableData', 'Based on available data')}
          </div>
        </div>

        {/* 2. Nearby Settlements */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  {t('whatIf.nearbySettlements', 'Nearby Settlements')}
                </h4>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                {t('whatIf.settlementDataUnavailable', 'Settlement data unavailable')}
              </span>
            </div>

            <div className="mt-3">
              {settlements?.available && settlements.data ? (
                <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg text-xs text-gray-800">
                  {JSON.stringify(settlements.data)}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{t('whatIf.settlementDataUnavailable', 'Settlement data unavailable')}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
            {t('whatIf.noVerifiedDataAvailable', 'No verified data available')}
          </div>
        </div>

        {/* 3. Critical Infrastructure */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  {t('whatIf.criticalInfrastructure', 'Critical Infrastructure')}
                </h4>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                {t('whatIf.criticalInfrastructureUnavailable', 'Critical infrastructure data unavailable')}
              </span>
            </div>

            <div className="mt-3">
              {critical_infrastructure?.available && critical_infrastructure.data ? (
                <div className="p-3 bg-slate-50 border border-gray-200 rounded-lg text-xs text-gray-800">
                  {JSON.stringify(critical_infrastructure.data)}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>
                    {t('whatIf.criticalInfrastructureUnavailable', 'Critical infrastructure data unavailable')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
            {t('whatIf.noVerifiedDataAvailable', 'No verified data available')}
          </div>
        </div>

        {/* 4. Emergency Access */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Ambulance className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  {t('whatIf.emergencyAccess', 'Emergency Access')}
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                {emergency_access?.status === 'Potentially Restricted'
                  ? t('whatIf.potentiallyRestricted', 'Potentially Restricted')
                  : emergency_access?.status === 'Potentially Delayed'
                  ? t('whatIf.potentiallyDelayed', 'Potentially Delayed')
                  : t('whatIf.potentiallyAffected', 'Potentially Affected')}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-lg text-xs text-rose-900 font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>
                  {emergency_access?.description ||
                    t('whatIf.emergencyRouteNote', 'Emergency response may require an alternative route.')}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium">
                {t('whatIf.emergencyRouteNote', 'Emergency response may require an alternative route.')}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
            {t('whatIf.basedOnAvailableData', 'Based on available data')}
          </div>
        </div>
      </div>
    </div>
  );
}
