import React, { useMemo } from 'react';
import { MapPin, AlertCircle, Compass, Shield, Activity, Droplets, Mountain } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { NER_STATES } from '../../data/nerStates';

export default function WhatIfLocationSelector({
  zones = [],
  selectedStateFilter = '',
  setSelectedStateFilter,
  selectedZone,
  setSelectedZone,
  onRunAnalysis,
  loadingAnalysis,
  error
}) {
  const { t } = useLanguage();

  // Strict state-to-location dependency: filter zones strictly by the chosen NER state
  const filteredZones = useMemo(() => {
    if (!selectedStateFilter || selectedStateFilter === 'All NER States' || selectedStateFilter === 'All NER') {
      return [];
    }
    return zones.filter(
      (z) => (z.state || '').trim().toLowerCase() === selectedStateFilter.trim().toLowerCase()
    );
  }, [zones, selectedStateFilter]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedStateFilter(newState);
    setSelectedZone(null); // Clear previous selected zone when state changes
  };

  const handleZoneChange = (e) => {
    const zoneId = Number(e.target.value);
    if (!zoneId) {
      setSelectedZone(null);
      return;
    }
    const found = zones.find((z) => z.id === zoneId) || null;
    setSelectedZone(found);
  };

  const getRiskBadgeClass = (level) => {
    switch ((level || '').toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MODERATE':
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-tight">
            {t('whatIf.selectLocationTitle', 'Select Risk Location')}
          </h2>
          <p className="text-xs text-gray-500">
            {t('whatIf.selectStateFirst', 'Select an NER state, then select the target risk zone.')}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* State & Location Dropdowns with Strict Dependency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. State Selector */}
        <div>
          <label htmlFor="whatif-state-select" className="block text-xs font-bold text-gray-700 mb-1.5">
            {t('whatIf.selectNerState', 'State')} <span className="text-red-500">*</span>
          </label>
          <select
            id="whatif-state-select"
            value={selectedStateFilter}
            onChange={handleStateChange}
            className="w-full text-sm font-semibold border border-gray-300 rounded-lg px-3.5 py-2.5 bg-white text-gray-900 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="">{t('whatIf.selectNerStatePlaceholder', 'Select NER State')}</option>
            {NER_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* 2. District / Risk Zone Selector (Dependent on State) */}
        <div>
          <label htmlFor="whatif-location-select" className="block text-xs font-bold text-gray-700 mb-1.5">
            {t('whatIf.selectLocationLabel', 'District / Zone')} <span className="text-red-500">*</span>
          </label>
          <select
            id="whatif-location-select"
            value={selectedZone?.id || ''}
            onChange={handleZoneChange}
            disabled={!selectedStateFilter || filteredZones.length === 0}
            className="w-full text-sm font-semibold border border-gray-300 rounded-lg px-3.5 py-2.5 bg-white text-gray-900 shadow-2xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {!selectedStateFilter ? (
              <option value="">{t('whatIf.selectStateFirst', 'Select NER State first')}</option>
            ) : filteredZones.length === 0 ? (
              <option value="">{t('whatIf.noVerifiedZones', 'No locations available for this state')}</option>
            ) : (
              <>
                <option value="">{t('whatIf.selectLocationPlaceholder', 'Select Location')}</option>
                {filteredZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} {z.district ? `(${z.district})` : ''} — Risk {z.current_risk_score}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Notice if selected state has no verified zones */}
      {selectedStateFilter && filteredZones.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
          {t('whatIf.noVerifiedZones', 'No verified risk zones available for')} {selectedStateFilter}.
        </div>
      )}

      {/* Prominent Selected Location & Current Risk Card */}
      {selectedZone && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {t('whatIf.selectedLocation', 'Selected Location')}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <strong className="text-base sm:text-lg font-black text-gray-900">
                  {selectedZone.name}
                </strong>
                <span className="text-xs text-gray-600 font-medium">
                  ({selectedZone.district ? `${selectedZone.district}, ` : ''}{selectedZone.state})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                {t('whatIf.currentRisk', 'Current Risk')}:
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border uppercase ${getRiskBadgeClass(selectedZone.current_risk_level)}`}>
                {t(`riskLevels.${selectedZone.current_risk_level}`, selectedZone.current_risk_level)}
              </span>
            </div>
          </div>

          {/* Telemetry and Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500 block font-medium">{t('whatIf.riskScore', 'Risk Score')}</span>
              <strong className="text-gray-950 text-sm sm:text-base font-black">
                {selectedZone.current_risk_score} / 100
              </strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500 block font-medium">24h Rainfall</span>
              <strong className="text-gray-900 text-sm font-bold">
                {selectedZone.rainfall_24h !== undefined ? `${selectedZone.rainfall_24h} mm` : 'N/A'}
              </strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500 block font-medium">Soil Moisture</span>
              <strong className="text-gray-900 text-sm font-bold">
                {selectedZone.soil_moisture !== undefined ? `${selectedZone.soil_moisture}%` : 'N/A'}
              </strong>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500 block font-medium">Slope / Elevation</span>
              <strong className="text-gray-900 text-sm font-bold">
                {selectedZone.slope !== undefined ? `${selectedZone.slope}°` : ''}{' '}
                {selectedZone.elevation !== undefined ? `(${selectedZone.elevation}m)` : ''}
              </strong>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={loadingAnalysis}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Compass className={`w-4 h-4 flex-shrink-0 ${loadingAnalysis ? 'animate-spin' : ''}`} />
              <span>
                {loadingAnalysis
                  ? t('whatIf.analyzing', 'Analyzing What-If...')
                  : t('whatIf.analyzeWhatIf', 'Analyze What-If')}
              </span>
            </button>
            <p className="text-center text-xs text-indigo-900/80 font-medium mt-2">
              {t('whatIf.whatCouldHappen', 'What could happen if a landslide occurs here?')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
