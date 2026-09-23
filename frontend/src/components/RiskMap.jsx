import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents, Rectangle } from 'react-leaflet';
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
import {
  Shield,
  AlertTriangle,
  Info,
  Languages,
  Globe,
  Compass,
  MapPin,
  CloudRain,
  Droplets,
  Mountain,
  Activity,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

// 8 Reference Test Locations representing each NER state
export const NER_REFERENCE_POINTS = [
  { state: "Assam", city: "Guwahati", latitude: 26.1445, longitude: 91.7362 },
  { state: "Arunachal Pradesh", city: "Itanagar", latitude: 27.0844, longitude: 93.6053 },
  { state: "Meghalaya", city: "Shillong", latitude: 25.5788, longitude: 91.8933 },
  { state: "Manipur", city: "Imphal", latitude: 24.8170, longitude: 93.9368 },
  { state: "Mizoram", city: "Aizawl", latitude: 23.7271, longitude: 92.7176 },
  { state: "Nagaland", city: "Kohima", latitude: 25.6751, longitude: 94.1086 },
  { state: "Tripura", city: "Agartala", latitude: 23.8315, longitude: 91.2868 },
  { state: "Sikkim", city: "Gangtok", latitude: 27.3389, longitude: 88.6065 }
];

function MapController({ selectedZone, fitBoundsTarget, stateBounds, mapTarget }) {
  const map = useMap();

  useEffect(() => {
    if (mapTarget) {
      map.setView(mapTarget, 10, { animate: true });
    } else if (fitBoundsTarget) {
      map.fitBounds(fitBoundsTarget, { padding: [30, 30], maxZoom: 11, animate: true });
    } else if (stateBounds) {
      map.fitBounds(stateBounds, { padding: [25, 25], maxZoom: 10, animate: true });
    } else if (selectedZone && isValidNerCoordinate(selectedZone.latitude, selectedZone.longitude)) {
      map.setView([selectedZone.latitude, selectedZone.longitude], 9, { animate: true });
    } else {
      map.fitBounds(NER_BOUNDS, { padding: [20, 20], animate: true });
    }
  }, [selectedZone, fitBoundsTarget, stateBounds, mapTarget, map]);

  return null;
}

function MapEventsHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick && e.latlng) {
        onMapClick(e.latlng);
      }
    }
  });
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

  // Custom clicked location state
  const [customPoint, setCustomPoint] = useState(null);
  const [mapTarget, setMapTarget] = useState(null);
  const [outsideNerWarning, setOutsideNerWarning] = useState(false);
  const [liveZoneTelemetry, setLiveZoneTelemetry] = useState({});

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

  // Inspect arbitrary point in NER
  const inspectLocation = async (lat, lng, locationName = null) => {
    setCustomPoint({
      latitude: lat,
      longitude: lng,
      name: locationName,
      loading: true,
      data: null,
      error: null
    });

    try {
      const res = await api.getLocationEnvironment(lat, lng, locationName);
      setCustomPoint({
        latitude: lat,
        longitude: lng,
        name: locationName || res.location?.name,
        loading: false,
        data: res,
        error: null
      });

      const synthesizedZone = {
        id: `custom_${lat}_${lng}`,
        name: res.location?.name || `NER Location (${lat}, ${lng})`,
        state: res.location?.state || 'Assam',
        district: res.location?.nearest_city || 'Regional Sector',
        latitude: lat,
        longitude: lng,
        current_risk_score: res.risk_assessment?.risk_score ?? 0,
        current_risk_level: res.risk_assessment?.risk_level ?? 'LOW',
        rainfall_24h: res.environmental_data?.rainfall_24h ?? 0,
        rainfall_72h: res.environmental_data?.rainfall_72h ?? 0,
        soil_moisture: res.environmental_data?.soil_moisture_percent ?? 0,
        elevation: res.location?.elevation ?? 0,
        slope: 22,
        historical_landslide_count: 2,
        isCustom: true
      };

      if (onSelectZone) {
        onSelectZone(synthesizedZone);
      }
    } catch (err) {
      console.error('Failed to load Open-Meteo environmental telemetry:', err);
      setCustomPoint({
        latitude: lat,
        longitude: lng,
        name: locationName,
        loading: false,
        data: null,
        error: 'Failed to retrieve live Open-Meteo telemetry.'
      });
    }
  };

  const handleMapClick = async (latlng) => {
    const lat = Number(latlng.lat.toFixed(4));
    const lng = Number(latlng.lng.toFixed(4));

    if (!isValidNerCoordinate(lat, lng)) {
      setOutsideNerWarning(true);
      setTimeout(() => setOutsideNerWarning(false), 4500);
      return;
    }

    setOutsideNerWarning(false);
    setMapTarget([lat, lng]);
    await inspectLocation(lat, lng);
  };

  const handleSelectReferenceCity = async (ref) => {
    setMapTarget([ref.latitude, ref.longitude]);
    setSelectedState(ref.state);
    await inspectLocation(ref.latitude, ref.longitude, `${ref.city}, ${ref.state}`);
  };

  const fetchLiveTelemetryForZone = async (zone) => {
    if (!zone || !zone.latitude || !zone.longitude) return;
    setLiveZoneTelemetry(prev => ({
      ...prev,
      [zone.id]: { loading: true, data: null, error: null }
    }));
    try {
      const data = await api.getLocationEnvironment(zone.latitude, zone.longitude, zone.name);
      setLiveZoneTelemetry(prev => ({
        ...prev,
        [zone.id]: { loading: false, data, error: null }
      }));
    } catch (e) {
      setLiveZoneTelemetry(prev => ({
        ...prev,
        [zone.id]: { loading: false, data: null, error: 'Failed to fetch Open-Meteo data' }
      }));
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
                setMapTarget(null);
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

      {/* ── Quick Test Reference Cities Bar & Arbitrary Location Notice ── */}
      <div className="px-3 py-2 bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-indigo-50/90 border-b border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-blue-950 font-bold">
          <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>{t('riskMap.clickMapToAnalyze', 'Click anywhere in NER to inspect live environmental data')}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-0.5 scrollbar-thin">
          <span className="text-[10px] font-black tracking-wide text-blue-800 uppercase whitespace-nowrap">
            {t('riskMap.referencePoints', 'Test Cities')}:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {NER_REFERENCE_POINTS.map((ref) => {
              const isActive = customPoint && Math.abs(customPoint.latitude - ref.latitude) < 0.01 && Math.abs(customPoint.longitude - ref.longitude) < 0.01;
              return (
                <button
                  key={ref.city}
                  type="button"
                  onClick={() => handleSelectReferenceCity(ref)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-gray-200'
                  }`}
                  title={`${ref.city}, ${ref.state} (${ref.latitude}, ${ref.longitude})`}
                >
                  {ref.city}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Map Surface ── */}
      <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px]">
        <MapContainer
          bounds={NER_BOUNDS}
          maxBounds={NER_MAX_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={6}
          scrollWheelZoom={true}
          className="w-full h-full z-0 cursor-crosshair"
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
            mapTarget={mapTarget}
          />

          <MapEventsHandler onMapClick={handleMapClick} />

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
            const liveData = liveZoneTelemetry[zone.id];

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
                  <div className="font-sans text-xs min-w-[220px] max-w-[280px] p-1">
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
                      <span className="font-medium text-right text-gray-800">
                        {liveData?.data ? `${liveData.data.environmental_data.rainfall_24h} mm` : `${zone.rainfall_24h} mm`}
                      </span>

                      <span className="text-gray-500">{t('riskMap.rainfall72h', '72h Rainfall')}:</span>
                      <span className="font-medium text-right text-gray-800">
                        {liveData?.data ? `${liveData.data.environmental_data.rainfall_72h} mm` : `${zone.rainfall_72h} mm`}
                      </span>

                      <span className="text-gray-500">{t('riskMap.soilMoisture', 'Soil Moisture')}:</span>
                      <span className="font-medium text-right text-gray-800">
                        {liveData?.data ? `${liveData.data.environmental_data.soil_moisture_percent}%` : `${zone.soil_moisture}%`}
                      </span>

                      <span className="text-gray-500">{t('riskMap.elevation', 'Elevation')}:</span>
                      <span className="font-medium text-right text-gray-800">
                        {liveData?.data ? `${liveData.data.environmental_data.elevation} m` : `${zone.elevation} m`}
                      </span>

                      <span className="text-gray-500">{t('riskMap.slope', 'Slope')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.slope}°</span>

                      <span className="text-gray-500">{t('riskMap.histLandslides', 'Hist. Landslides')}:</span>
                      <span className="font-medium text-right text-gray-800">{zone.historical_landslide_count}</span>
                    </div>

                    {/* Live Open-Meteo Query Button for Zone */}
                    {!liveData?.data && (
                      <div className="mt-2 pt-1 border-t">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchLiveTelemetryForZone(zone);
                          }}
                          disabled={liveData?.loading}
                          className="w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[10px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors cursor-pointer"
                        >
                          {liveData?.loading ? (
                            <Loader2 className="w-3 h-3 animate-spin text-teal-600" />
                          ) : (
                            <RefreshCw className="w-3 h-3 text-teal-600" />
                          )}
                          <span>{liveData?.loading ? 'Fetching live weather...' : 'Check Live Open-Meteo Data'}</span>
                        </button>
                      </div>
                    )}

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

          {/* Custom User Clicked or Reference Location Marker */}
          {customPoint && (
            <CircleMarker
              center={[customPoint.latitude, customPoint.longitude]}
              pathOptions={{
                color: '#0f766e',
                fillColor: '#14b8a6',
                fillOpacity: 0.92,
                weight: 3.5
              }}
              radius={14}
            >
              <Popup className="ner-risk-popup" autoPan={true}>
                <div className="font-sans text-xs min-w-[240px] max-w-[290px] p-1">
                  {customPoint.loading ? (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-500 gap-2">
                      <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[11px] font-medium text-teal-800">
                        {t('riskMap.fetchingEnvironmentalData', 'Fetching live Open-Meteo data...')}
                      </span>
                    </div>
                  ) : customPoint.error ? (
                    <div className="p-2 text-red-600 font-medium text-[11px]">
                      {customPoint.error}
                    </div>
                  ) : customPoint.data ? (
                    <div>
                      {/* Title & Live Badge */}
                      <div className="flex items-start justify-between border-b pb-1.5 mb-2">
                        <div>
                          <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                            <span>OPEN-METEO LIVE</span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight mt-1">
                            {customPoint.data.location.name}
                          </h3>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {customPoint.data.location.state}
                            {customPoint.data.location.nearest_city && customPoint.data.location.distance_to_nearest_city_km > 0
                              ? ` • ${customPoint.data.location.distance_to_nearest_city_km}km from ${customPoint.data.location.nearest_city}`
                              : ''}
                          </p>
                        </div>
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ml-2 flex-shrink-0"
                          style={{
                            backgroundColor: `${getColor(customPoint.data.risk_assessment.risk_level)}20`,
                            color: getColor(customPoint.data.risk_assessment.risk_level),
                            border: `1px solid ${getColor(customPoint.data.risk_assessment.risk_level)}40`
                          }}
                        >
                          {t(`riskLevels.${customPoint.data.risk_assessment.risk_level}`, customPoint.data.risk_assessment.risk_level)}
                        </span>
                      </div>

                      {/* XGBoost Risk Score */}
                      <div className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded mb-2 border border-gray-100">
                        <span className="font-semibold text-gray-600 text-xs">{t('riskMap.riskIndex', 'Risk Index')}:</span>
                        <span className="font-bold text-sm text-gray-900">
                          {customPoint.data.risk_assessment.risk_score}
                          <span className="text-[10px] text-gray-400 font-normal"> / 100</span>
                        </span>
                      </div>

                      {/* Real Open-Meteo Telemetry Grid */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-600 border-t pt-1.5">
                        <span className="text-gray-500">{t('riskMap.rainfall24h', '24h Rainfall')}:</span>
                        <span className="font-bold text-right text-gray-900">{customPoint.data.environmental_data.rainfall_24h} mm</span>

                        <span className="text-gray-500">{t('riskMap.rainfall72h', '72h Rainfall')}:</span>
                        <span className="font-bold text-right text-gray-900">{customPoint.data.environmental_data.rainfall72h || customPoint.data.environmental_data.rainfall_72h} mm</span>

                        <span className="text-gray-500">{t('riskMap.soilMoisture', 'Soil Moisture')}:</span>
                        <span className="font-bold text-right text-gray-900">{customPoint.data.environmental_data.soil_moisture_percent}%</span>

                        <span className="text-gray-500">{t('riskMap.elevation', 'Elevation')}:</span>
                        <span className="font-bold text-right text-gray-900">{customPoint.data.environmental_data.elevation} m</span>

                        <span className="text-gray-500">Source:</span>
                        <span className="font-medium text-right text-gray-600">Open-Meteo</span>

                        <span className="text-gray-500">Model:</span>
                        <span className="font-medium text-right text-gray-600">XGBoost CPU</span>
                      </div>

                      {/* What-If Action Button */}
                      <div className="pt-2 border-t mt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onWhatIf) {
                              onWhatIf({
                                id: `custom_${customPoint.latitude}_${customPoint.longitude}`,
                                name: customPoint.data.location.name,
                                state: customPoint.data.location.state,
                                latitude: customPoint.latitude,
                                longitude: customPoint.longitude,
                                current_risk_score: customPoint.data.risk_assessment.risk_score,
                                current_risk_level: customPoint.data.risk_assessment.risk_level,
                                rainfall_24h: customPoint.data.environmental_data.rainfall_24h,
                                rainfall_72h: customPoint.data.environmental_data.rainfall_72h,
                                soil_moisture: customPoint.data.environmental_data.soil_moisture_percent,
                                elevation: customPoint.data.environmental_data.elevation
                              });
                            }
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{t('whatIf.whatIfButton', 'What If?')}</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>

        {/* Warning Toast for clicking outside NER */}
        {outsideNerWarning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-3.5 py-2 rounded-lg shadow-xl z-[400] text-xs font-bold flex items-center gap-2 pointer-events-auto border border-amber-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{t('riskMap.outsideNer', 'Selected point is outside the North Eastern Region bounds.')}</span>
          </div>
        )}

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
          <div className="mt-1 flex items-center justify-end gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('riskMap.liveOpenMeteoTelemetry', 'LIVE OPEN-METEO TELEMETRY')}</span>
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
                      setMapTarget(null);
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