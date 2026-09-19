import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// NER Bounds
// South, West to North, East
const NER_BOUNDS = [
  [21.5, 88.0],
  [29.5, 97.5]
];

// Padding for max bounds so users can't pan away entirely
const MAX_BOUNDS = [
  [19.0, 85.0],
  [31.0, 100.0]
];

const NER_STATES = [
  "All NER",
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim"
];

function MapController({ selectedZone, fitStateBounds, bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (fitStateBounds) {
      map.fitBounds(fitStateBounds, { padding: [20, 20], animate: true });
    } else if (selectedZone) {
      map.setView([selectedZone.latitude, selectedZone.longitude], 10, { animate: true });
    } else {
      map.fitBounds(NER_BOUNDS, { animate: true });
    }
  }, [selectedZone, fitStateBounds, map]);

  return null;
}

export default function RiskMap({ zones, onSelectZone, selectedZone }) {
  const [filterState, setFilterState] = useState("All NER");

  const getColor = (level) => {
    switch(level) {
      case 'CRITICAL': return '#ef4444'; // red-500
      case 'HIGH': return '#f97316'; // orange-500
      case 'MODERATE': return '#eab308'; // yellow-500
      default: return '#22c55e'; // green-500
    }
  };

  const filteredZones = filterState === "All NER" 
    ? zones 
    : zones.filter(z => z.state === filterState);

  // Calculate bounds for the selected state if filtered
  let currentBounds = null;
  if (filterState !== "All NER" && filteredZones.length > 0) {
    const lats = filteredZones.map(z => z.latitude);
    const lngs = filteredZones.map(z => z.longitude);
    currentBounds = [
      [Math.min(...lats) - 0.5, Math.min(...lngs) - 0.5],
      [Math.max(...lats) + 0.5, Math.max(...lngs) + 0.5]
    ];
  } else if (filterState === "All NER") {
    currentBounds = NER_BOUNDS;
  }

  return (
    <div className="w-full h-full flex flex-col relative bg-white rounded-lg">
      
      {/* Header Area */}
      <div className="p-3 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">North Eastern Region Risk Map</h2>
          <p className="text-xs text-gray-500">Arunachal Pradesh • Assam • Manipur • Meghalaya • Mizoram • Nagaland • Tripura • Sikkim</p>
        </div>
        <select 
          value={filterState}
          onChange={(e) => {
            setFilterState(e.target.value);
            onSelectZone(null); // Clear specific selection when filtering
          }}
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-blue-500 focus:border-blue-500"
        >
          {NER_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative w-full h-full">
        <MapContainer 
          bounds={NER_BOUNDS}
          maxBounds={MAX_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={5}
          scrollWheelZoom={true} 
          className="w-full h-full z-0" 
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController selectedZone={selectedZone} fitStateBounds={currentBounds} />
          
          {filteredZones.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={[zone.latitude, zone.longitude]}
              pathOptions={{ 
                color: getColor(zone.current_risk_level), 
                fillColor: getColor(zone.current_risk_level),
                fillOpacity: 0.8,
                weight: selectedZone?.id === zone.id ? 4 : 2
              }}
              radius={selectedZone?.id === zone.id ? 12 : 8}
              eventHandlers={{
                click: () => onSelectZone(zone),
              }}
            >
              <Popup>
                <div className="font-sans min-w-[200px]">
                  <h3 className="font-bold text-gray-900 text-base border-b pb-1 mb-2">
                    {zone.name}, {zone.state}
                  </h3>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Risk Score:</span>
                    <span className="font-bold">{zone.current_risk_score.toFixed(0)}/100</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">Risk Level:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: getColor(zone.current_risk_level) + '33', color: getColor(zone.current_risk_level) }}>
                      {zone.current_risk_level}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600 border-t pt-2">
                    <div className="font-medium text-gray-500">24h Rainfall:</div>
                    <div className="text-right">{zone.rainfall_24h} mm</div>
                    
                    <div className="font-medium text-gray-500">72h Rainfall:</div>
                    <div className="text-right">{zone.rainfall_72h} mm</div>
                    
                    <div className="font-medium text-gray-500">Soil Moisture:</div>
                    <div className="text-right">{zone.soil_moisture} %</div>
                    
                    <div className="font-medium text-gray-500">Slope:</div>
                    <div className="text-right">{zone.slope}°</div>
                    
                    <div className="font-medium text-gray-500">Elevation:</div>
                    <div className="text-right">{zone.elevation} m</div>
                    
                    <div className="font-medium text-gray-500">Hist. Landslides:</div>
                    <div className="text-right">{zone.historical_landslide_count}</div>
                    
                    <div className="font-medium text-gray-500">Last Updated:</div>
                    <div className="text-right">
                      {zone.last_updated 
                        ? new Date(zone.last_updated).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) 
                        : new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* NER Label overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded shadow border border-gray-200 z-[400] text-center pointer-events-none hidden sm:block">
          <div className="text-[10px] font-bold text-blue-600 tracking-wider">PRAHARI-NER</div>
          <div className="text-xs font-bold text-gray-800">NORTH EASTERN REGION</div>
          <div className="text-[10px] font-semibold text-gray-500">8 STATES</div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow border border-gray-200 text-xs font-medium z-[400]">
          <div className="mb-2 font-bold text-gray-700">Risk Level</div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Critical</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> High</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Moderate</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Low</div>
          </div>
        </div>
      </div>
    </div>
  );
}
