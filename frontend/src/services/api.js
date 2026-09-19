import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_URL,
  // Do NOT follow redirects automatically for POST — always use correct URL with trailing slash
});

const api = {
  getHealth:             () => client.get('/health').then(res => res.data),
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
};

export default api;
