import React from 'react';
import { CloudRain, Thermometer } from 'lucide-react';

export default function WeatherPanel({ weatherData, selectedZone }) {
  if (!weatherData) return null;
  
  // Find weather for selected zone, or default to first
  const zoneWeather = weatherData.find(w => w.location === selectedZone?.name) || weatherData[0];
  
  if (!zoneWeather) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Weather</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">24h Rainfall</span>
          </div>
          <span className="text-sm font-bold text-gray-900">{zoneWeather.rainfall_24h} mm</span>
        </div>
        
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">72h Rainfall</span>
          </div>
          <span className="text-sm font-bold text-gray-900">{zoneWeather.rainfall_72h} mm</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Temperature</span>
          </div>
          <span className="text-sm font-bold text-gray-900">{zoneWeather.temperature}°C</span>
        </div>
        
        <div className="mt-2 bg-blue-50 rounded p-2 text-center">
          <span className="text-xs font-semibold text-blue-800 uppercase">Forecast: {zoneWeather.forecast}</span>
        </div>
      </div>
    </div>
  );
}
