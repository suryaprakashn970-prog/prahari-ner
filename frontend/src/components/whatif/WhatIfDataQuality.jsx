import React from 'react';
import { Database, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatIfDataQuality({ dataQuality, roadImpact }) {
  const { t } = useLanguage();

  const level = (dataQuality?.level || 'LIMITED').toUpperCase();

  const getQualityBadge = (lvl) => {
    switch (lvl) {
      case 'HIGH':
        return {
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          text: t('whatIf.dataQualityHigh', 'HIGH'),
          icon: ShieldCheck,
        };
      case 'MEDIUM':
        return {
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          text: t('whatIf.dataQualityMedium', 'MEDIUM'),
          icon: CheckCircle2,
        };
      default:
        return {
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
          text: t('whatIf.dataQualityLimited', 'LIMITED'),
          icon: AlertTriangle,
        };
    }
  };

  const currentBadge = getQualityBadge(level);
  const BadgeIcon = currentBadge.icon;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wider">
            {t('whatIf.scenarioDataQuality', 'SCENARIO DATA QUALITY')}
          </h3>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${currentBadge.badgeClass}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{currentBadge.text}</span>
        </span>
      </div>

      <div className="text-xs text-gray-700 leading-relaxed font-medium">
        <p className="mb-2">
          {dataQuality?.description ||
            t(
              'whatIf.disclaimer',
              'This is a scenario analysis based on available data.'
            )}
        </p>
      </div>

      {/* Honest Data Inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
          <span className="font-bold text-emerald-900 block">
            ✓ {t('whatIf.verifiedTelemetry', 'Verified Telemetry Sources')}
          </span>
          <ul className="text-emerald-800 space-y-0.5 list-disc list-inside text-[11px]">
            <li>{t('whatIf.sourceRiskZones', 'XGBoost Trained Geological Slope Risk')}</li>
            {roadImpact?.available && (
              <li>{t('whatIf.sourceRoads', 'PWD / NHAI Road Corridor Telemetry')}</li>
            )}
          </ul>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
          <span className="font-bold text-slate-800 block">
            ℹ {t('whatIf.uncatalogedSectors', 'Unmonitored Sectors')}
          </span>
          <ul className="text-slate-600 space-y-0.5 list-disc list-inside text-[11px]">
            <li>{t('whatIf.sourceSettlementsPending', 'Village settlement census pending')}</li>
            <li>{t('whatIf.sourceInfraPending', 'Hospital / helipad telemetry pending')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
