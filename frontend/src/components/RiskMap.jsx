import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  NER_STATES,
  NER_LANGUAGES_MAP,
  NER_BOUNDS,
  NER_MAX_BOUNDS,
  STATE_METADATA,
  isNerState,
  isValidNerCoordinate
} from '../data/nerStates';
import { Shield, AlertTriangle, Info, Languages, Globe, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function MapController({ selectedZone, fitBoundsTarget, stateBounds }) {
  const map = useMap();

  useEffect(() => {
    if (fitBoundsTarget) {
      map.fitBounds(fitBoundsTarget, { padding: [30, 30], maxZoom: 11, animate: true });
    } else if (stateBounds) {
      map.fitBounds(stateBounds, { padding: [25, 25], maxZoom: 10, animate: true });
    } else if (selectedZone && isValidNerCoordinate(selectedZone.latitude, selectedZone.longitude)) {
      map.setView([selectedZone.latitude, selectedZone.longitude], 9, { animate: true });
    } else {
      map.fitBounds(NER_BOUNDS, { padding: [20, 20], animate: true });
    }
  }, [selectedZone, fitBoundsTarget, stateBounds, map]);

  return null;
}

export default function RiskMap({ zones = [], onSelectZone, selectedZone, onWhatIf }) {
  const {
    selectedState,
    setSelectedState,
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
    t
  } = useLanguage();

  const filterState = selectedState;

  // Strict NER validation: only include zones belonging to the 8 NER states with valid coordinates
  const validNerZones = zones.filter(
    (z) => isNerState(z.state) && isValidNerCoordinate(z.latitude, z.longitude)
  );

  const isAllStates = filterState === "All NER States" || filterState === "All NER";

  // Filter by user selection
  const displayedZones = isAllStates
    ? validNerZones
    : validNerZones.filter((z) => z.state.toLowerCase() === filterState.toLowerCase());

  // Determine bounds to zoom to
  let activeBounds = null;
  let activeStateBounds = null;

  if (isAllStates) {
    activeBounds = NER_BOUNDS;
  } else if (displayedZones.length > 0) {
    const lats = displayedZones.map((z) => z.latitude);
    const lngs = displayedZones.map((z) => z.longitude);
    activeBounds = [
      [Math.min(...lats) - 0.25, Math.min(...lngs) - 0.25],
      [Math.max(...lats) + 0.25, Math.max(...lngs) + 0.25]
    ];
  } else if (STATE_METADATA[filterState]) {
    activeStateBounds = STATE_METADATA[filterState].bounds;
  }

  const getColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return '#dc2626';
      case 'HIGH':
        return '#ea580c';
      case 'MODERATE':
        return '#ca8a04';
      default:
        return '#16a34a';
    }
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* ── Top Header & State Selector Dropdown ── */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              {t('riskMap.title', 'North Eastern Region Risk Map')}
            </h2>
            <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {t('riskMap.eightNerStates', '8 NER States')}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {t('riskMap.pageSubtitle', 'AI-based landslide risk monitoring across the 8 North Eastern states')}
          </p>
        </div>

        {/* ── State & Application Language Controls ── */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* State Select Dropdown */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ner-state-select"
              className="text-xs font-bold text-gray-700 whitespace-nowrap"
            >
              {t('riskMap.selectNerState', 'Select NER State')}
            </label>
            <select
              id="ner-state-select"
              value={selectedState}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedState(val);
                if (onSelectZone) onSelectZone(null);
              }}
              className="w-full sm:w-56 min-h-[44px] h-[44px] text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="All NER States">{t('riskMap.allNerStates', 'All NER States')}</option>
              {NER_STATES.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>

          {/* Application Language Select Dropdown */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ner-lang-select"
              className="text-xs font-bold text-gray-700 whitespace-nowrap flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              {t('riskMap.applicationLanguage', 'Application Language')}
            </label>
            <select
              id="ner-lang-select"
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
              }}
              className="w-full sm:w-56 min-h-[44px] h-[44px] text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.englishName}){!lang.isSupported ? ` — ${t('common.comingSoon', 'Coming soon')}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Map Surface ── */}
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px]">
        <MapContainer
          bounds={NER_BOUNDS}
          maxBounds={NER_MAX_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={6}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            selectedZone={selectedZone}
            fitBoundsTarget={activeBounds}
            stateBounds={activeStateBounds}
          />

          {/* Render State Outline Highlight for selected state */}
          {!isAllStates && STATE_METADATA[filterState] && (
            <Rectangle
              bounds={STATE_METADATA[filterState].bounds}
              pathOptions={{
                color: '#2563eb',
                weight: 2,
                dashArray: '4, 6',
                fillOpacity: 0.04,
                fillColor: '#3b82f6'
              }}
            />
          )}

          {/* Render Valid Risk Zone Markers within NER */}
          {displayedZones.map((zone) => {
            const isSelected = selectedZone?.id === zone.id;
            const color = getColor(zone.current_risk_level);
            const localizedRiskLevel = t(`riskLevels.${zone.current_risk_level}`, zone.current_risk_level);

            return (
              <CircleMarker
                key={zone.id}
                center={[zone.latitude, zone.longitude]}
                pathOptions={{
                  color: isSelected ? '#1e293b' : color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: isSelected ? 3.5 : 2
                }}
                radius={isSelected ? 13 : 9}
                eventHandlers={{
                  click: () => {
                    if (onSelectZone) onSelectZone(zone);
                  },
                }}
              >
                <Popup className="ner-risk-popup">
                  <div className="font-sans text-xs min-w-[210px] max-w-[260px] p-1">
                    <div className="flex items-start justify-between border-b pb-1.5 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">
                          {zone.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {zone.district ? `${zone.district}, ` : ''}{zone.state}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ml-2 flex-shrink-0"
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                          border: `1px solid ${color}40`
                        }}
                      >
                        {localizedRiskLevel}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded mb-2 border border-gray-100">
                      <span className="font-semibold text-gray-600 text-xs">{t('riskMap.riskIndex', 'Risk Index')}:</span>
                      <span className="font-bold text-sm text-gray-900">
                        {typeof zone.current_risk_score === 'number'
                          ? zone.current_risk_score.toFixed(0)
                          : zone.current_risk_score}
                        <span className="text-[10px] text-gray-400 font-normal"> / 100</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-600 border-t pt-1.5">
                      <span className="text-gray-500">{t('riskMap.rainfall24h', '24h Rainfall')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.rainfall_24h} mm</span>

                      <span className="text-gray-500">{t('riskMap.rainfall72h', '72h Rainfall')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.rainfall_72h} mm</span>

                      <span className="text-gray-500">{t('riskMap.soilMoisture', 'Soil Moisture')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.soil_moisture}%</span>

                      <span className="text-gray-500">{t('riskMap.slope', 'Slope')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.slope}°</span>

                      <span className="text-gray-500">{t('riskMap.elevation', 'Elevation')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.elevation} m</span>

                      <span className="text-gray-500">{t('riskMap.histLandslides', 'Hist. Landslides')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.historical_landslide_count}</span>

                      <span className="text-gray-500">{t('riskMap.lastUpdated', 'Last Updated')}:</span>
                      <span className="font-medium text-right text-gray-800">
                        {zone.last_updated
                          ? new Date(zone.last_updated).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })
                          : 'Recent'}
                      </span>
                    </div>

                    {/* What-If Simulation Trigger Button */}
                    <div className="pt-2 border-t mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectZone) onSelectZone(zone);
                          if (onWhatIf) onWhatIf(zone);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{t('whatIf.whatIfButton', 'What If?')}</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Empty state overlay when a specific state has no data */}
        {!isAllStates && displayedZones.length === 0 && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-lg border border-amber-200 z-[400] text-center max-w-sm pointer-events-auto">
            <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{t('riskMap.noDataForState', 'No current risk data available for')} {filterState}.</span>
            </div>
            <p className="text-[11px] text-gray-600">
              {t('riskMap.noDataSub', 'No field stations or sensor telemetry currently reporting in this state.')}
            </p>
          </div>
        )}

        {/* NER Regional Badge & Data Provenance Indicator */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow border border-gray-200 z-[400] text-right pointer-events-none hidden sm:block">
          <div className="text-[10px] font-black text-blue-600 tracking-wider">PRAHARI-NER</div>
          <div className="text-xs font-bold text-gray-900">NORTH EASTERN REGION</div>
          <div className="text-[10px] font-medium text-gray-500">
            {displayedZones.length} {displayedZones.length === 1 ? t('riskMap.activeStationMapped', 'Active Station Mapped') : t('riskMap.activeStationsMapped', 'Active Stations Mapped')}
          </div>
          <div className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            {t('riskMap.prototypeTelemetry', 'PROTOTYPE / CACHED TELEMETRY')}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow border border-gray-200 text-xs z-[400] max-w-[170px]">
          <div className="text-[11px] font-bold text-gray-800 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-600" /> {t('riskMap.landslideRiskLevel', 'Landslide Risk Level')}
          </div>
          <div className="space-y-0.5 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0"></span>
              <span className="text-gray-700">{t('riskMap.criticalLegend', 'Critical (≥75)')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 flex-shrink-0"></span>
              <span className="text-gray-700">{t('riskMap.highLegend', 'High (50–74)')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-600 flex-shrink-0"></span>
              <span className="text-gray-700">{t('riskMap.moderateLegend', 'Moderate (25–49)')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 flex-shrink-0"></span>
              <span className="text-gray-700">{t('riskMap.lowLegend', 'Low (0–24)')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── State -> Language Information Section ── */}
      <div className="p-4 bg-slate-50 border-t border-gray-200">
        {!isAllStates ? (
          /* Single State Language View */
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  {t('riskMap.languagesOf', 'Languages of')} {filterState}
                </h3>
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {t('riskMap.selectedStateLabel', 'Selected State')}: <span className="font-bold text-blue-700">{filterState}</span>
              </div>
            </div>

            {/* Language Cards: stack vertically on mobile (grid-cols-1), expand on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
              {(NER_LANGUAGES_MAP[filterState] || []).map((lang) => (
                <div
                  key={lang.englishName}
                  className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-center min-h-[72px]"
                >
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {lang.englishName}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 mt-1 font-native-script leading-snug break-words">
                    {lang.nativeName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* All NER States Language Matrix */
          <div>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
              <Languages className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                  {t('riskMap.languagesOfNer', 'Languages of the North Eastern Region')}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {t('riskMap.languagesSub', 'Regional and indigenous languages spoken across all 8 North Eastern states')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {NER_STATES.map((stateName) => {
                const languages = NER_LANGUAGES_MAP[stateName] || [];
                return (
                  <div
                    key={stateName}
                    onClick={() => {
                      setSelectedState(stateName);
                      if (onSelectZone) onSelectZone(null);
                    }}
                    className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group flex flex-col justify-between"
                    title={`${t('riskMap.clickToFilter', 'Click to filter map to')} ${stateName}`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {stateName}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 group-hover:text-blue-600">
                          {languages.length} {languages.length === 1 ? t('riskMap.languageCount', 'language') : t('riskMap.languagesCount', 'languages')}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {languages.map((l) => (
                          <div
                            key={l.englishName}
                            className="flex items-baseline justify-between gap-1.5 text-xs"
                          >
                            <span className="font-medium text-gray-700 whitespace-nowrap">
                              {l.englishName}
                            </span>
                            <span className="text-gray-300 font-normal select-none">—</span>
                            <span className="font-semibold text-gray-900 font-native-script text-right break-words">
                              {l.nativeName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}