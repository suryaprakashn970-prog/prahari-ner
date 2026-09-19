import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhatIfScenario({ scenario, zone }) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-extrabold text-amber-950 uppercase tracking-wider">
              {t('whatIf.simulatedScenario', 'SIMULATED IMPACT SCENARIO')}
            </h3>
            {zone && (
              <span className="text-xs font-bold bg-white text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                {zone.name}, {zone.state}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
            {typeof scenario === 'object' && scenario?.subtitle
              ? scenario.subtitle
              : typeof scenario === 'string'
              ? scenario
              : t('whatIf.scenarioDescription', 'A landslide is simulated at the selected risk zone.')}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold bg-amber-100/60 px-2.5 py-1 rounded-md w-fit">
            <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
            <span>{t('whatIf.disclaimer', 'This is a scenario analysis based on available data.')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
