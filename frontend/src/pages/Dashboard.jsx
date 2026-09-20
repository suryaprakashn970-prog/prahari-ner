import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import api, { API_URL } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useSystemStatus } from '../context/SystemStatusContext';

// ── Emergency Contacts Block ─────────────────────────────────
function EmergencyContacts() {
  const { t } = useLanguage();
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
          {t('emergency.title', 'Emergency Contacts')}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#6b7280' }}>
          {t('emergency.callWithoutInternet', '— Call without internet')}
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
                {t('emergency.primaryBadge', 'Emergency')}
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
                112
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                {t('emergency.primarySub', 'Police · Fire · Ambulance')}
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
            {t('emergency.call112', '📞 Call 112')}
          </div>
        </div>
      </a>

      {/* ── Secondary three: 108 / 101 / 100 ────────────────── */}
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
            label={t('emergency.ambulance', 'Ambulance')}
            number="108"
            subtitle={t('emergency.ambulanceSub', 'Emergency medical assistance')}
            callText={t('emergency.callAmbulance', 'Call Ambulance')}
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
            label={t('emergency.fire', 'Fire')}
            number="101"
            subtitle={t('emergency.fireSub', 'Fire and rescue emergency')}
            callText={t('emergency.callFire', 'Call Fire')}
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
            label={t('emergency.police', 'Police')}
            number="100"
            subtitle={t('emergency.policeSub', 'Police emergency assistance')}
            callText={t('emergency.callPolice', 'Call Police')}
            borderColor="#2563eb"
            bg="#eff6ff"
            hoverBg="#dbeafe"
            numColor="#1e3a8a"
          />
        </a>
      </div>

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

// ── Dashboard Main Component ─────────────────────────────────
export default function Dashboard() {
  const { t } = useLanguage();
  const systemStatus = useSystemStatus();
  const navigate = useNavigate();
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
        setError(t('errors.failedToLoad', "Failed to load application data. Please ensure the backend is running."));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

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
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {t('dashboard.systemStatus', 'System Status')}
                  </h2>
                  <span className="text-[10px] text-gray-400 font-mono truncate max-w-[180px]" title={systemStatus.apiUrl}>
                    {systemStatus.apiUrl.replace(/^https?:\/\//, '')}
                  </span>
                </div>

                {systemStatus.isChecking ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
                      <span className="font-bold text-sm text-amber-700">
                        {t('common.checkingApi', 'Checking API...')}
                      </span>
                    </div>
                  </div>
                ) : systemStatus.isOnline ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">🟢</span>
                      <span className="font-bold text-sm text-green-700">
                        {t('common.systemOnline', 'System Online')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-green-600 mt-1 ml-6">
                      {t('common.apiConnected', 'API Connected')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">🔴</span>
                        <span className="font-bold text-sm text-red-700">
                          {t('common.systemOffline', 'System Offline')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => systemStatus.checkHealth()}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {t('common.retry', 'Retry')}
                      </button>
                    </div>
                    <p className="text-xs text-red-600 mt-1 ml-6 font-medium">
                      {t('dashboard.unreachableServer', 'API server is unreachable.')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Current Risk Summary ────────────────────────────── */}
            {selectedZone && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                  {t('dashboard.currentRisk', 'Current Risk')}
                </h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {selectedZone.current_risk_score.toFixed(0)} <span className="text-lg text-gray-400 font-medium">/ 100</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                    selectedZone.current_risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    selectedZone.current_risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    selectedZone.current_risk_level === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t(`riskLevels.${selectedZone.current_risk_level}`, selectedZone.current_risk_level)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1">
                  <p className="text-gray-600 font-medium">{selectedZone.name}, {selectedZone.state}</p>
                  {(selectedZone.current_risk_level === 'CRITICAL' || selectedZone.current_risk_level === 'HIGH') && (
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 w-fit">
                      {t('dashboard.avoidUnstableSlopes', 'Avoid unstable slopes.')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── Map Area ─────────────────────────────────────────── */}
            <div className="w-full relative z-0">
              <RiskMap 
                zones={riskZones} 
                onSelectZone={setSelectedZone} 
                selectedZone={selectedZone} 
                onWhatIf={(zone) => {
                  if (zone?.id) {
                    navigate('/what-if', { state: { selectedZone: zone } });
                  } else {
                    alert(t('whatIf.unavailableForLocation', 'What-If analysis is unavailable for this location.'));
                  }
                }}
              />
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
