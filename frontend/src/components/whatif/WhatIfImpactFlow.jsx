import React from 'react';
import { AlertTriangle, Route, Home, Ambulance, ShieldAlert, ArrowRight, ArrowDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatIfImpactFlow({ analysis }) {
  const { t } = useLanguage();

  if (!analysis) return null;

  const { zone, road_impact, emergency_access, response_priority } = analysis;

  const steps = [
    {
      id: 1,
      title: t('whatIf.flowStep1', 'Landslide Scenario'),
      subtitle: zone?.name ? `${zone.name}, ${zone.state}` : t('whatIf.simulatedScenario', 'SIMULATED SCENARIO'),
      statusText: `${t('whatIf.riskScore', 'Risk')}: ${zone?.current_risk_score || 0}`,
      statusColor: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertTriangle,
      iconColor: 'text-red-600 bg-red-50',
    },
    {
      id: 2,
      title: t('whatIf.flowStep2', 'Road Access'),
      subtitle: road_impact?.available
        ? `${road_impact.roads?.length || 0} ${t('whatIf.roadsIdentified', 'Roads')}`
        : t('whatIf.roadDataUnavailable', 'Road data unavailable'),
      statusText: road_impact?.available
        ? road_impact.roads?.some(r => r.status === 'BLOCKED')
          ? 'BLOCKED'
          : road_impact.roads?.some(r => r.status === 'AT RISK')
          ? 'AT RISK'
          : 'MONITORED'
        : 'UNAVAILABLE',
      statusColor: road_impact?.available
        ? road_impact.roads?.some(r => r.status === 'BLOCKED')
          ? 'bg-red-100 text-red-800 border-red-200'
          : 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Route,
      iconColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: 3,
      title: t('whatIf.flowStep3', 'Settlement Access'),
      subtitle: t('whatIf.settlementDataUnavailable', 'Settlement data unavailable'),
      statusText: 'UNAVAILABLE',
      statusColor: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Home,
      iconColor: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 4,
      title: t('whatIf.flowStep4', 'Emergency Access'),
      subtitle: emergency_access?.status || t('whatIf.potentiallyAffected', 'Potentially Affected'),
      statusText: emergency_access?.status === 'Potentially Restricted'
        ? t('whatIf.potentiallyRestricted', 'RESTRICTED')
        : t('whatIf.potentiallyDelayed', 'DELAYED'),
      statusColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Ambulance,
      iconColor: 'text-rose-600 bg-rose-50',
    },
    {
      id: 5,
      title: t('whatIf.flowStep5', 'Response Priority'),
      subtitle: `${response_priority?.score || 0} / 100`,
      statusText: response_priority?.level || 'HIGH',
      statusColor: response_priority?.level === 'CRITICAL'
        ? 'bg-red-100 text-red-800 border-red-200'
        : 'bg-orange-100 text-orange-800 border-orange-200',
      icon: ShieldAlert,
      iconColor: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">
          {t('whatIf.impactFlowTitle', 'Simulated Impact Cascade Flow')}
        </h3>
        <span className="text-xs font-semibold text-gray-500">
          {t('whatIf.basedOnAvailableData', 'Based on available data')}
        </span>
      </div>

      {/* Responsive Horizontal / Vertical Pipeline */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.iconColor}`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${step.statusColor}`}>
                    {step.statusText}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    {step.title}
                  </div>
                  <div className="text-xs font-bold text-gray-900 truncate mt-0.5" title={step.subtitle}>
                    {step.subtitle}
                  </div>
                </div>
              </div>

              {!isLast && (
                <div className="hidden lg:flex items-center justify-center text-gray-400 px-1">
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              )}
              {!isLast && (
                <div className="flex lg:hidden items-center justify-center text-gray-400 py-0.5">
                  <ArrowDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
