import axios from 'axios';

/**
 * Centralized API Base URL resolver.
 * Priority:
 * 1. import.meta.env.VITE_API_URL
 * 2. import.meta.env.VITE_API_BASE_URL
 * 3. Production hostname detection -> https://prahari-backend.onrender.com
 * 4. Localhost fallback -> http://127.0.0.1:8000
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://prahari-backend.onrender.com';
  }
  return 'http://127.0.0.1:8000';
};

export const API_URL = getApiBaseUrl();

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

/**
 * Controlled health-check with configurable retry logic.
 */
export const checkHealthWithRetry = async (retries = 2, delayMs = 1500) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await client.get('/health');
      if (res.data && (res.data.status === 'ok' || res.data.status === 'healthy' || (typeof res.data.message === 'string' && res.data.message.includes('Prahari')))) {
        return { status: 'ok', data: res.data };
      }
    } catch (err) {
      // Graceful fallback to root endpoint if /health 404s
      if (err.response && err.response.status === 404) {
        try {
          const rootRes = await client.get('/');
          if (rootRes.data && (rootRes.data.status === 'healthy' || (typeof rootRes.data.message === 'string' && rootRes.data.message.includes('Prahari')))) {
            return { status: 'ok', data: rootRes.data };
          }
        } catch (_) {
          // fallback failed, continue retry loop
        }
      }
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  return { status: 'error' };
};

const api = {
  getHealth:             () => client.get('/health').then(res => res.data).catch(() => client.get('/').then(res => res.data)),
  getRoot:               () => client.get('/').then(res => res.data),
  getModelStatus:        () => client.get('/api/model/status').then(res => res.data),

  getRiskZones:          () => client.get('/api/risk/zones').then(res => res.data),
  predictRisk:     (data) => client.post('/api/risk/predict', data).then(res => res.data),

  getWeather:            () => client.get('/api/weather/').then(res => res.data),
  getRoads:              () => client.get('/api/roads/').then(res => res.data),

  getAlerts:             () => client.get('/api/alerts/').then(res => res.data),
  createAlert:     (data) => client.post('/api/alerts/', data).then(res => res.data),
  updateAlert: (id, data) => client.patch(`/api/alerts/${id}`, data).then(res => res.data),

  // Reports — trailing slash matches FastAPI router("/") POST handler at /api/reports/
  getReports:            () => client.get('/api/reports/').then(res => res.data),
  createReport:    (data) => client.post('/api/reports/', data).then(res => res.data),
  updateReport: (id, data) => client.patch(`/api/reports/${id}`, data).then(res => res.data),

  getResponsePriorities: () => client.get('/api/response/priorities').then(res => res.data),
  sendNotification: (data) => client.post('/api/notifications/send', data).then(res => res.data),
  runWhatIfAnalysis: (zoneId) => client.post('/api/risk/what-if', { zone_id: zoneId }).then(res => res.data),
};

export default api;
