import axios from 'axios';

/**
 * Centralized API Base URL Configuration.
 * ONE source of truth for the entire PRAHARI-NER frontend.
 * Production FastAPI Render Backend: https://prahari-backend-4via.onrender.com
 */

const DEFAULT_PRODUCTION_API_URL = 'https://prahari-backend-4via.onrender.com';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_PRODUCTION_API_URL
).trim().replace(/\/+$/, '');

export const API_URL = API_BASE_URL;

// 1. Log environment variable and computed URLs in browser console
console.log('[PRAHARI-NER API Config] import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('[PRAHARI-NER API Config] Final API_BASE_URL:', API_BASE_URL);
console.log('[PRAHARI-NER API Config] Final Health URL:', `${API_BASE_URL}/health`);

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * Robust health check implementation.
 * Queries ${API_BASE_URL}/health via fetch.
 */
/**
 * Robust health check implementation.
 * Tries:
 * 1. Axios client.get('/health') (uses the same client that successfully fetches model & risk zones)
 * 2. Native fetch to ${API_BASE_URL}/health
 * 3. Axios fallback to root '/'
 * 4. Verification fallback to '/api/model/status'
 */
export async function checkApiHealth() {
  const healthUrl = `${API_BASE_URL}/health`;
  console.log('[PRAHARI-NER HealthCheck] Checking backend health at:', healthUrl);

  // 1. Primary: Use Axios client
  try {
    const res = await client.get('/health');
    console.log('[PRAHARI-NER HealthCheck] Axios /health success:', res.data);
    if (
      res.data &&
      (res.data.status === 'ok' ||
        res.data.status === 'healthy' ||
        (typeof res.data.message === 'string' && res.data.message.includes('Prahari')))
    ) {
      return { status: 'ok', data: res.data };
    }
  } catch (axiosErr) {
    console.warn('[PRAHARI-NER HealthCheck] Axios /health error:', axiosErr?.message || axiosErr);
  }

  // 2. Secondary: Fallback to native fetch
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      console.log('[PRAHARI-NER HealthCheck] fetch /health success:', data);
      if (
        data &&
        (data.status === 'ok' ||
          data.status === 'healthy' ||
          (typeof data.message === 'string' && data.message.includes('Prahari')))
      ) {
        return { status: 'ok', data };
      }
    }
  } catch (fetchErr) {
    console.warn('[PRAHARI-NER HealthCheck] fetch /health error:', fetchErr?.message || fetchErr);
  }

  // 3. Fallback to root endpoint /
  try {
    const rootRes = await client.get('/');
    console.log('[PRAHARI-NER HealthCheck] Axios / fallback success:', rootRes.data);
    if (
      rootRes.data &&
      (rootRes.data.status === 'ok' ||
        rootRes.data.status === 'healthy' ||
        (typeof rootRes.data.message === 'string' && rootRes.data.message.includes('Prahari')))
    ) {
      return { status: 'ok', data: rootRes.data };
    }
  } catch (_) {}

  // 4. Confirmed live fallback: If model status responds, the backend is 100% online
  try {
    const modelRes = await client.get('/api/model/status');
    if (modelRes.data && (modelRes.data.loaded || modelRes.data.model)) {
      console.log('[PRAHARI-NER HealthCheck] Confirmed online via model/status:', modelRes.data);
      return {
        status: 'ok',
        data: { status: 'healthy', message: 'Prahari-AI Sentinel Backend Online' },
      };
    }
  } catch (_) {}

  console.error('[PRAHARI-NER HealthCheck] All health check attempts failed for:', healthUrl);
  return { status: 'error', error: 'API server unreachable' };
}

// Backward-compatibility wrapper for checkHealthWithRetry
export const checkHealthWithRetry = async (retries = 2, delayMs = 1200) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await checkApiHealth();
    if (res.status === 'ok') {
      return res;
    }
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return { status: 'error' };
};

const api = {
  getHealth:             () => checkApiHealth().then(res => res.data || res),
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
