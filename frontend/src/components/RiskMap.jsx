import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  NER_STATES,
  NER_BOUNDS,
  NER_MAX_BOUNDS,
  STATE_METADATA,
  isNerState,
  isValidNerCoordinate
} from '../data/nerStates';
import { Shield, AlertTriangle, Info, MapPin } from 'lucide-react';

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

export default function RiskMap({ zones = [], onSelectZone, selectedZone }) {
  const [filterState, setFilterState] = useState("All NER");

  // Strict NER validation: only include zones belonging to the 8 NER states with valid coordinates
  const validNerZones = zones.filter(
    (z) => isNerState(z.state) && isValidNerCoordinate(z.latitude, z.longitude)
  );

  // Filter by user selection
  const displayedZones = filterState === "All NER"
    ? validNerZones
    : validNerZones.filter((z) => z.state.toLowerCase() === filterState.toLowerCase());

  // Determine bounds to zoom to
  let activeBounds = null;
  let activeStateBounds = null;

  if (filterState === "All NER") {
    activeBounds = NER_BOUNDS;
  } else if (displayedZones.length > 0) {
    const lats = displayedZones.map((z) => z.latitude);
    const lngs = displayedZones.map((z) => z.longitude);
    activeBounds = [
      [Math.min(...lats) - 0.25, Math.min(...lngs) - 0.25],
      [Math.max(...lats) + 0.25, Math.max(...lngs) + 0.25]
    ];
  } else if (STATE_METADATA[filterState]) {
    // If selected state has no risk data yet, zoom to state's geographical extent
    activeStateBounds = STATE_METADATA[filterState].bounds;
  }

  const getColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return '#dc2626'; // red-600
      case 'HIGH':
        return '#ea580c'; // orange-600
      case 'MODERATE':
        return '#ca8a04'; // yellow-600
      default:
        return '#16a34a'; // green-600
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* Map Header & Filter */}
      <div className="p-3 bg-slate-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              North Eastern Region Risk Map
            </h2>
            <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              8 NER States
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            AI-based landslide risk monitoring across the 8 North Eastern states
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="state-filter" className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Filter State:
          </label>
          <select
            id="state-filter"
            value={filterState}
            onChange={(e) => {
              const val = e.target.value;
              setFilterState(val);
              if (onSelectZone) onSelectZone(null);
            }}
            className="flex-1 sm:flex-none text-xs font-medium border border-gray-300 rounded-md px-2.5 py-1.5 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All NER">All NER (8 States)</option>
            {NER_STATES.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Surface */}
      <div className="flex-1 relative w-full h-full min-h-[300px]">
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

          {/* Render State Highlights / Extents for the 8 NER States */}
          {filterState !== "All NER" && STATE_METADATA[filterState] && (
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
                        {zone.current_risk_level}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded mb-2 border border-gray-100">
                      <span className="font-semibold text-gray-600 text-xs">Risk Index:</span>
                      <span className="font-bold text-sm text-gray-900">
                        {typeof zone.current_risk_score === 'number'
                          ? zone.current_risk_score.toFixed(0)
                          : zone.current_risk_score}
                        <span className="text-[10px] text-gray-400 font-normal"> / 100</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-600 border-t pt-1.5">
                      <span className="text-gray-500">24h Rainfall:</span>
                      <span className="font-medium text-right text-gray-800">{zone.rainfall_24h} mm</span>

                      <span className="text-gray-500">72h Rainfall:</span>
                      <span className="font-medium text-right text-gray-800">{zone.rainfall_72h} mm</span>

                      <span className="text-gray-500">Soil Moisture:</span>
                      <span className="font-medium text-right text-gray-800">{zone.soil_moisture}%</span>

                      <span className="text-gray-500">Slope:</span>
                      <span className="font-medium text-right text-gray-800">{zone.slope}°</span>

                      <span className="text-gray-500">Elevation:</span>
                      <span className="font-medium text-right text-gray-800">{zone.elevation} m</span>

                      <span className="text-gray-500">Hist. Landslides:</span>
                      <span className="font-medium text-right text-gray-800">{zone.historical_landslide_count}</span>

                      <span className="text-gray-500">Last Updated:</span>
                      <span className="font-medium text-right text-gray-800">
                        {zone.last_updated
                          ? new Date(zone.last_updated).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })
                          : 'Recent'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Empty state overlay when a specific state has no data */}
        {filterState !== "All NER" && displayedZones.length === 0 && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-lg border border-amber-200 z-[400] text-center max-w-sm pointer-events-auto">
            <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>No current risk data available for {filterState}.</span>
            </div>
            <p className="text-[11px] text-gray-600">
              No field stations or sensor telemetry currently reporting in this state.
            </p>
          </div>
        )}

        {/* NER Regional Badge & Data Provenance Indicator */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow border border-gray-200 z-[400] text-right pointer-events-none hidden sm:block">
          <div className="text-[10px] font-black text-blue-600 tracking-wider">PRAHARI-NER</div>
          <div className="text-xs font-bold text-gray-900">NORTH EASTERN REGION</div>
          <div className="text-[10px] font-medium text-gray-500">
            {displayedZones.length} Active {displayedZones.length === 1 ? 'Station' : 'Stations'} Mapped
          </div>
          <div className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            PROTOTYPE / CACHED TELEMETRY
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-2.5 rounded-lg shadow border border-gray-200 text-xs z-[400] max-w-[170px]">
          <div className="text-[11px] font-bold text-gray-800 mb-1.5 flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-600" /> Landslide Risk Level
          </div>
          <div className="space-y-1 text-[11px] font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0"></span>
              <span className="text-gray-700">Critical (≥75)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-600 flex-shrink-0"></span>
              <span className="text-gray-700">High (50–74)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-600 flex-shrink-0"></span>
              <span className="text-gray-700">Moderate (25–49)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
              <span className="text-gray-700">Low (0–24)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}