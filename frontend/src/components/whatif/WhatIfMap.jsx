import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertTriangle, Route } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { NER_BOUNDS, NER_MAX_BOUNDS, isValidNerCoordinate } from '../../data/nerStates';

function WhatIfMapController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && isValidNerCoordinate(center[0], center[1])) {
      map.setView(center, 10, { animate: true });
    } else {
      map.fitBounds(NER_BOUNDS, { padding: [20, 20], animate: true });
    }
  }, [center, map]);

  return null;
}

export default function WhatIfMap({ selectedZone, analysis }) {
  const { t } = useLanguage();

  const hasValidZoneCoords =
    selectedZone && isValidNerCoordinate(selectedZone.latitude, selectedZone.longitude);

  const centerCoord = hasValidZoneCoords
    ? [Number(selectedZone.latitude), Number(selectedZone.longitude)]
    : [25.5788, 91.8933]; // Default Meghalaya center if none

  const roads = analysis?.road_impact?.roads || [];
  const validRoads = roads.filter(
    (r) => r.latitude && r.longitude && isValidNerCoordinate(r.latitude, r.longitude)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-gray-900">
            {t('whatIf.mapTitle', 'Scenario Impact Map')}
          </h3>
        </div>
        {selectedZone && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
            {selectedZone.name}, {selectedZone.state}
          </span>
        )}
      </div>

      {!hasValidZoneCoords && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {t('whatIf.mapLocationUnavailable', 'Map location unavailable for this zone.')}
          </span>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div className="h-[360px] sm:h-[420px] w-full relative">
        <MapContainer
          center={centerCoord}
          zoom={hasValidZoneCoords ? 10 : 7}
          bounds={NER_BOUNDS}
          maxBounds={NER_MAX_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={6}
          className="h-full w-full z-0"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <WhatIfMapController center={hasValidZoneCoords ? centerCoord : null} />

          {/* Scenario Center Marker & Simulation Buffer */}
          {hasValidZoneCoords && (
            <>
              {/* Simulated Impact Radius (e.g. 8 km corridor) */}
              <Circle
                center={centerCoord}
                radius={8000}
                pathOptions={{
                  color: '#dc2626',
                  fillColor: '#ef4444',
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '6, 6',
                }}
              />

              {/* Precise Epicenter Marker */}
              <CircleMarker
                center={centerCoord}
                radius={12}
                pathOptions={{
                  color: '#991b1b',
                  fillColor: '#dc2626',
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="block text-sm text-gray-950 font-bold">
                      {selectedZone.name}
                    </strong>
                    <div className="text-gray-600 font-medium">{selectedZone.state}</div>
                    <div className="pt-1 border-t border-gray-200">
                      <span className="font-bold text-red-600">
                        {t('whatIf.simulatedScenario', 'SIMULATED IMPACT SCENARIO')}
                      </span>
                    </div>
                    <div>
                      {t('whatIf.riskScore', 'Risk Score')}:{' '}
                      <strong>{selectedZone.current_risk_score} / 100</strong>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </>
          )}

          {/* Connected Verified Roads Markers */}
          {validRoads.map((road) => {
            const isBlocked = road.status === 'BLOCKED';
            const isAtRisk = road.status === 'AT RISK' || road.status === 'WARNING';
            const markerColor = isBlocked ? '#dc2626' : isAtRisk ? '#f59e0b' : '#10b981';

            return (
              <CircleMarker
                key={road.id}
                center={[Number(road.latitude), Number(road.longitude)]}
                radius={8}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: markerColor,
                  fillOpacity: 0.9,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="block text-sm font-bold text-gray-900">{road.name}</strong>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{t('whatIf.status', 'Status')}:</span>
                      <strong className="uppercase" style={{ color: markerColor }}>
                        {road.status}
                      </strong>
                    </div>
                    {road.distance_km !== null && road.distance_km !== undefined && (
                      <div className="text-gray-600">
                        {t('whatIf.distance', 'Distance')}: ~{road.distance_km} km
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-xs p-2.5 rounded-lg shadow-md border border-gray-200 text-[11px] space-y-1">
          <div className="font-bold text-gray-900 mb-1">
            {t('whatIf.mapTitle', 'Scenario Map Legend')}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-white" />
            <span className="text-gray-700 font-medium">
              {t('whatIf.simulatedScenario', 'Simulated Epicenter')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white" />
            <span className="text-gray-700 font-medium">
              {t('whatIf.roadAccess', 'Road At Risk')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-white" />
            <span className="text-gray-700 font-medium">{t('whatIf.status', 'Road Open')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
