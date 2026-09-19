import React from 'react';
import { ShieldAlert, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatIfPriority({ priority, zone }) {
  const { t } = useLanguage();

  if (!priority) return null;

  const score = priority.score ?? 50;
  const level = (priority.level || 'MEDIUM').toUpperCase();
  const baseScore = priority.base_risk_score ?? (zone?.current_risk_score ?? 50);
  const roadAdj = priority.road_adjustment ?? 0;

  const getBadgeStyle = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-red-600 text-white border-red-700';
      case 'HIGH':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MODERATE':
      case 'MEDIUM':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const getProgressColor = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-red-600';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MODERATE':
      case 'MEDIUM':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-600';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wider">
            {t('whatIf.responsePriority', 'SIMULATED RESPONSE PRIORITY')}
          </h3>
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full border tracking-wide uppercase ${getBadgeStyle(level)}`}>
          {t(`riskLevels.${level}`, level)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Big Score Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
            {score.toFixed(1)}
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-600">/ 100</span>
        </div>

        {/* Progress Bar & Breakdown */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>{t('whatIf.priorityCalculation', 'Simulated Priority Index')}</span>
            <span className="text-gray-900 font-bold">{score}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getProgressColor(level)}`}
              style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Formula Transparency Box */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('whatIf.scoringModel', 'Dynamic Priority Formula')}</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {t('whatIf.scoringExplanation', 'Base Zone Risk')} ({baseScore})
          {roadAdj > 0 ? ` + Road Corridor Obstruction Penalty (+${roadAdj})` : ` + Road Hazard Adjustment (+0)`}
          {' = '}
          <strong className="text-slate-900">{score}</strong> (Clamped 1–100)
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-medium">
        <Info className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
        <span>{t('whatIf.disclaimer', 'This is a scenario analysis based on available data.')}</span>
      </div>
    </div>
  );
}
