import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import api from '../services/api';

export default function AlertPanel({ alerts = [], onAlertUpdated }) {
  const navigate = useNavigate();
  const [localAlerts, setLocalAlerts] = useState(alerts);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [acknowledgingIds, setAcknowledgingIds] = useState(new Set());
  const [actionError, setActionError] = useState('');

  // Synchronize with parent props when fresh alerts arrive
  useEffect(() => {
    setLocalAlerts(alerts || []);
  }, [alerts]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedAlert(null);
    };
    if (selectedAlert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAlert]);

  const isAlertAcknowledged = (alert) => {
    if (!alert) return false;
    const status = (alert.status || '').toUpperCase();
    return status === 'ACKNOWLEDGED' || alert.is_active === false;
  };

  const handleAcknowledge = async (alertId) => {
    if (acknowledgingIds.has(alertId)) return;

    const alertToAck = localAlerts.find((a) => a.id === alertId);
    if (alertToAck && isAlertAcknowledged(alertToAck)) return;

    setActionError('');
    setAcknowledgingIds((prev) => new Set(prev).add(alertId));

    try {
      // Send real PATCH to FastAPI backend: PATCH /api/alerts/{id}
      const updated = await api.updateAlert(alertId, {
        status: 'ACKNOWLEDGED',
        is_active: false
      });

      // Update state in place
      setLocalAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? {
                ...a,
                ...updated,
                status: 'ACKNOWLEDGED',
                is_active: false
              }
            : a
        )
      );

      // Also update selectedAlert if modal is currently open
      setSelectedAlert((prev) => {
        if (prev && prev.id === alertId) {
          return {
            ...prev,
            ...updated,
            status: 'ACKNOWLEDGED',
            is_active: false
          };
        }
        return prev;
      });

      if (onAlertUpdated) {
        onAlertUpdated(updated);
      }
    } catch (err) {
      console.error('Alert acknowledgement error:', err);
      setActionError('Could not acknowledge this alert. Please try again.');
    } finally {
      setAcknowledgingIds((prev) => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    }
  };

  const activeCount = localAlerts.filter((a) => !isAlertAcknowledged(a)).length;

  const getSeverityStyle = (level) => {
    switch ((level || '').toUpperCase()) {
      case 'CRITICAL':
        return {
          badgeBg: 'bg-red-100 text-red-800 border-red-200',
          borderL: 'border-l-red-600',
          cardBg: 'bg-red-50/50 border-red-200',
          iconColor: 'text-red-600'
        };
      case 'HIGH':
        return {
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
          borderL: 'border-l-orange-500',
          cardBg: 'bg-orange-50/50 border-orange-200',
          iconColor: 'text-orange-500'
        };
      case 'MODERATE':
        return {
          badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          borderL: 'border-l-yellow-500',
          cardBg: 'bg-yellow-50/50 border-yellow-200',
          iconColor: 'text-yellow-600'
        };
      default:
        return {
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
          borderL: 'border-l-blue-500',
          cardBg: 'bg-blue-50/50 border-blue-200',
          iconColor: 'text-blue-600'
        };
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header with calculated active alert count */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Active Alerts ({activeCount})
        </h2>
        {localAlerts.length > activeCount && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {localAlerts.length - activeCount} Acknowledged
          </span>
        )}
      </div>

      {actionError && (
        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center justify-between">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError('')}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Alert List */}
      {localAlerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-gray-600">No active alerts.</p>
          <p className="text-xs text-gray-400 mt-1">All monitored NER risk sectors are within normal limits.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-1">
          {localAlerts.map((alert) => {
            const acknowledged = isAlertAcknowledged(alert);
            const isProcessing = acknowledgingIds.has(alert.id);
            const style = getSeverityStyle(alert.risk_level);

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border border-l-4 transition-all ${style.borderL} ${
                  acknowledged ? 'bg-gray-50 border-gray-200 opacity-75' : style.cardBg
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${style.badgeBg}`}
                    >
                      {alert.risk_level || 'ALERT'}
                    </span>
                    {alert.state && (
                      <span className="text-[11px] font-medium text-gray-600 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {alert.location ? `${alert.location}, ` : ''}{alert.state}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {alert.created_at
                      ? new Date(alert.created_at).toLocaleDateString()
                      : 'Recent'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-800 font-medium my-2 line-clamp-2">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200/50">
                  <button
                    type="button"
                    onClick={() => setSelectedAlert(alert)}
                    className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={acknowledged || isProcessing}
                    className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                      acknowledged
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : isProcessing
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isProcessing
                      ? 'Acknowledging...'
                      : acknowledged
                      ? '✓ Acknowledged'
                      : 'Acknowledge'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAlert(null);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    Alert #{selectedAlert.id} Details
                  </h3>
                  <p className="text-xs text-gray-500">Early Warning Dispatch Log</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              {/* Severity & Status Badges */}
              <div className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Severity Level
                  </span>
                  <span
                    className={`inline-block font-extrabold px-2.5 py-0.5 rounded text-xs mt-0.5 border ${
                      getSeverityStyle(selectedAlert.risk_level).badgeBg
                    }`}
                  >
                    {selectedAlert.risk_level}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Lifecycle Status
                  </span>
                  <span
                    className={`inline-block font-bold px-2.5 py-0.5 rounded text-xs mt-0.5 ${
                      isAlertAcknowledged(selectedAlert)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isAlertAcknowledged(selectedAlert) ? '✓ ACKNOWLEDGED' : 'ACTIVE'}
                  </span>
                </div>
              </div>

              {/* Alert Message */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Alert Message
                </span>
                <div className="p-3 bg-white rounded-lg border border-gray-200 text-gray-900 font-medium">
                  {selectedAlert.message}
                </div>
              </div>

              {/* Location & Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                  <span className="text-gray-500 font-semibold block">State</span>
                  <span className="font-bold text-gray-800">
                    {selectedAlert.state || selectedAlert.zone?.state || 'North Eastern Region'}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                  <span className="text-gray-500 font-semibold block">District / Sector</span>
                  <span className="font-bold text-gray-800">
                    {selectedAlert.location || selectedAlert.district || selectedAlert.zone?.name || 'NER Hazard Zone'}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                  <span className="text-gray-500 font-semibold block">Calculated Risk Score</span>
                  <span className="font-bold text-gray-800">
                    {selectedAlert.risk_score != null
                      ? `${selectedAlert.risk_score} / 100`
                      : selectedAlert.zone?.current_risk_score != null
                      ? `${selectedAlert.zone.current_risk_score} / 100`
                      : 'Telemetry Linked'}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                  <span className="text-gray-500 font-semibold block">Timestamp (UTC)</span>
                  <span className="font-bold text-gray-800">
                    {selectedAlert.created_at
                      ? new Date(selectedAlert.created_at).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })
                      : 'Recent'}
                  </span>
                </div>
              </div>

              {/* Zone Telemetry if linked */}
              {selectedAlert.zone && (
                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-gray-700">
                  <span className="font-bold text-blue-900 block mb-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-600" /> Linked Geotechnical Parameters
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>24h Rain: <strong className="text-gray-900">{selectedAlert.zone.rainfall_24h} mm</strong></div>
                    <div>72h Rain: <strong className="text-gray-900">{selectedAlert.zone.rainfall_72h} mm</strong></div>
                    <div>Soil Moisture: <strong className="text-gray-900">{selectedAlert.zone.soil_moisture}%</strong></div>
                    <div>Slope: <strong className="text-gray-900">{selectedAlert.zone.slope}°</strong></div>
                  </div>
                </div>
              )}

              {/* Protocol Recommendation */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-1">Standard Operating Protocol:</span>
                <p className="text-[11px] leading-relaxed">
                  {selectedAlert.risk_level === 'CRITICAL'
                    ? 'Immediate evacuation advisory and field reconnaissance required. Notify district disaster management authority (DDMA) and road maintenance units.'
                    : 'Monitor slope saturation telemetry and notify field spotters along critical transit arteries.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-gray-200 flex items-center justify-between gap-3">
              {(selectedAlert.latitude || selectedAlert.zone?.latitude) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate('/risk-map');
                  }}
                  className="text-xs bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on Risk Map
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setSelectedAlert(null)}
                  className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                >
                  Close
                </button>

                {!isAlertAcknowledged(selectedAlert) && (
                  <button
                    type="button"
                    disabled={acknowledgingIds.has(selectedAlert.id)}
                    onClick={() => handleAcknowledge(selectedAlert.id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg font-bold shadow-xs transition-colors disabled:bg-gray-300"
                  >
                    {acknowledgingIds.has(selectedAlert.id) ? 'Acknowledging...' : 'Acknowledge Alert'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}