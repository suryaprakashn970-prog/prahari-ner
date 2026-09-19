import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import ModelStatus from '../components/ModelStatus';
import RiskMap from '../components/RiskMap';
import RiskFactors from '../components/RiskFactors';
import AlertPanel from '../components/AlertPanel';
import WeatherPanel from '../components/WeatherPanel';
import RoadStatus from '../components/RoadStatus';
import FieldReports from '../components/FieldReports';
import ResponsePriority from '../components/ResponsePriority';
import DataSourceStatus from '../components/DataSourceStatus';
import ManualPredictionForm from '../components/ManualPredictionForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import api from '../services/api';

// ── Emergency Contacts Block ─────────────────────────────────
// All buttons use real tel: links. No login, no location, no internet needed
// for the call itself. Meets 44px min touch target throughout.

function EmergencyContacts() {
  return (
    <div
      aria-label="Emergency contacts"
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        padding: '16px 16px 12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      }}
    >
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#111827', letterSpacing: '-0.2px' }}>
          Emergency Contacts
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#6b7280' }}>
          — Call without internet
        </span>
      </div>

      {/* ── 112 — PRIMARY (full width on all sizes) ─────────── */}
      <a
        href="tel:112"
        aria-label="Call 112 — Emergency Police Fire Ambulance"
        style={{ display: 'block', textDecoration: 'none', marginBottom: 10 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            borderRadius: 10,
            padding: '16px 20px',
            boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
            cursor: 'pointer',
            minHeight: 72,
            transition: 'filter 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'none'}
          onTouchStart={e => e.currentTarget.style.filter = 'brightness(1.08)'}
          onTouchEnd={e => e.currentTarget.style.filter = 'none'}
        >
          {/* Left: icon + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32, lineHeight: 1 }}>🚨</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
                Emergency
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
                112
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Police · Fire · Ambulance
              </div>
            </div>
          </div>
          {/* Right: call pill */}
          <div style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            borderRadius: 24,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 800,
            color: '#fff',
            whiteSpace: 'nowrap',
            letterSpacing: '0.3px',
          }}>
            📞 Call 112
          </div>
        </div>
      </a>

      {/* ── Secondary three: 108 / 101 / 100 ────────────────── */}
      {/* 
          Mobile:  stacked — 108 full, 101+100 side by side on sm, or all stacked on xs
          Desktop: three equal columns
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
        className="emergency-secondary-grid"
      >
        {/* 108 — Ambulance */}
        <a
          href="tel:108"
          aria-label="Call 108 — Ambulance emergency"
          style={{ textDecoration: 'none' }}
        >
          <SecondaryEmergencyCard
            emoji="🚑"
            label="Ambulance"
            number="108"
            subtitle="Emergency medical assistance"
            callText="Call Ambulance"
            borderColor="#059669"
            bg="#f0fdf4"
            hoverBg="#dcfce7"
            numColor="#065f46"
          />
        </a>

        {/* 101 — Fire */}
        <a
          href="tel:101"
          aria-label="Call 101 — Fire and rescue emergency"
          style={{ textDecoration: 'none' }}
        >
          <SecondaryEmergencyCard
            emoji="🚒"
            label="Fire"
            number="101"
            subtitle="Fire and rescue emergency"
            callText="Call Fire"
            borderColor="#d97706"
            bg="#fffbeb"
            hoverBg="#fef3c7"
            numColor="#92400e"
          />
        </a>

        {/* 100 — Police */}
        <a
          href="tel:100"
          aria-label="Call 100 — Police emergency"
          style={{ textDecoration: 'none' }}
        >
          <SecondaryEmergencyCard
            emoji="👮"
            label="Police"
            number="100"
            subtitle="Police emergency assistance"
            callText="Call Police"
            borderColor="#2563eb"
            bg="#eff6ff"
            hoverBg="#dbeafe"
            numColor="#1e3a8a"
          />
        </a>
      </div>

      {/* Responsive override: on xs screens, stack secondary cards */}
      <style>{`
        @media (max-width: 479px) {
          .emergency-secondary-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 480px) and (max-width: 639px) {
          .emergency-secondary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function SecondaryEmergencyCard({ emoji, label, number, subtitle, callText, borderColor, bg, hoverBg, numColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        background: hovered ? hoverBg : bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 8,
        padding: '12px 10px',
        cursor: 'pointer',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 3,
        transition: 'background 0.15s',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <div style={{ fontSize: 10, fontWeight: 700, color: numColor, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: numColor, lineHeight: 1, letterSpacing: '-0.5px' }}>{number}</div>
      <div style={{ fontSize: 9, color: '#6b7280', lineHeight: 1.3, marginTop: 1 }}>{subtitle}</div>
      <div style={{
        marginTop: 6,
        padding: '4px 10px',
        borderRadius: 20,
        background: borderColor,
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.3px',
      }}>
        {callText}
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────

export default function Dashboard() {
  const [modelStatus, setModelStatus] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);
  const [riskZones, setRiskZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [roads, setRoads] = useState([]);
  const [reports, setReports] = useState([]);
  const [priorities, setPriorities] = useState([]);
  
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          modelRes, dataRes, zonesRes, alertsRes, 
          weatherRes, roadsRes, reportsRes, prioritiesRes
        ] = await Promise.all([
          api.getModelStatus().catch(() => ({ loaded: false })),
          api.getHealth().catch(() => ({ status: 'error' })),
          api.getRiskZones().catch(() => []),
          api.getAlerts().catch(() => []),
          api.getWeather().catch(() => ({ data: [] })),
          api.getRoads().catch(() => []),
          api.getReports().catch(() => []),
          api.getResponsePriorities().catch(() => [])
        ]);

        setModelStatus(modelRes);
        setDataStatus(dataRes);
        setRiskZones(zonesRes);
        setAlerts(alertsRes);
        setWeatherData(weatherRes?.data || weatherRes || []);
        setRoads(roadsRes);
        setReports(reportsRes);
        setPriorities(prioritiesRes);
        
        if (zonesRes && zonesRes.length > 0) {
          setSelectedZone(zonesRes[0]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Failed to load application data. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <PageLayout dataStatus={dataStatus}>
      <div className="flex flex-col gap-4">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => window.location.reload()} />
        ) : (
          <>
            {/* ── Emergency Contacts — always first, always visible ── */}
            <EmergencyContacts />

            {/* ── Status Row ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModelStatus status={modelStatus} />
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-center">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">System Status</h2>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dataStatus?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-bold ${dataStatus?.status === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
                    {dataStatus?.status === 'ok' ? 'System Online' : 'System Offline'}
                  </span>
                </div>
                {dataStatus?.status !== 'ok' && (
                  <p className="text-xs text-gray-500 mt-2">API server at {import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'} is unreachable.</p>
                )}
              </div>
            </div>

            {/* ── Current Risk Summary ────────────────────────────── */}
            {selectedZone && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Current Risk</h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-extrabold text-gray-900">{selectedZone.current_risk_score.toFixed(0)} <span className="text-lg text-gray-400 font-medium">/ 100</span></span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                    selectedZone.current_risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    selectedZone.current_risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    selectedZone.current_risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedZone.current_risk_level}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 font-medium">{selectedZone.name}, {selectedZone.state}</p>
              </div>
            )}

            {/* ── Map Area ─────────────────────────────────────────── */}
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 h-[350px] lg:h-[500px] relative z-0">
              <RiskMap zones={riskZones} onSelectZone={setSelectedZone} selectedZone={selectedZone} />
            </div>

            {/* ── Risk Factors ─────────────────────────────────────── */}
            {selectedZone && (
              <RiskFactors zone={selectedZone} />
            )}

            {/* ── Three column secondary data ───────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AlertPanel alerts={alerts} />
              <WeatherPanel weatherData={weatherData} selectedZone={selectedZone} />
              <RoadStatus roads={roads} />
            </div>

            {/* ── Operational data ─────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FieldReports reports={reports} />
              <div className="flex flex-col gap-4">
                <ManualPredictionForm />
                <ResponsePriority priorities={priorities} selectedZone={selectedZone} />
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
