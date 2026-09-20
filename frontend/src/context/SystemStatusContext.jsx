import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL, checkApiHealth } from '../services/api';

const SystemStatusContext = createContext({
  status: 'checking', // 'checking' | 'online' | 'offline'
  isOnline: false,
  isChecking: true,
  isOffline: false,
  healthData: null,
  apiUrl: API_BASE_URL,
  healthUrl: `${API_BASE_URL}/health`,
  checkHealth: async () => {},
});

export function SystemStatusProvider({ children }) {
  const [status, setStatus] = useState('checking'); // starts in 'checking'
  const [healthData, setHealthData] = useState(null);
  const isCheckingRef = useRef(false);

  const checkHealth = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setStatus('checking');

    try {
      const result = await checkApiHealth();
      if (result.status === 'ok') {
        console.log('[PRAHARI-NER SystemStatus] Backend is ONLINE:', result.data);
        setStatus('online');
        setHealthData(result.data);
      } else {
        console.warn('[PRAHARI-NER SystemStatus] Backend is OFFLINE:', result);
        setStatus('offline');
        setHealthData(null);
      }
    } catch (err) {
      console.error('[PRAHARI-NER SystemStatus] Unexpected error in checkHealth:', err);
      setStatus('offline');
      setHealthData(null);
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkHealth();

    // Periodic heartbeat every 45s
    const interval = setInterval(() => {
      checkHealth();
    }, 45000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  const value = {
    status,
    isOnline: status === 'online',
    isChecking: status === 'checking',
    isOffline: status === 'offline',
    healthData,
    apiUrl: API_BASE_URL,
    healthUrl: `${API_BASE_URL}/health`,
    checkHealth,
  };

  return (
    <SystemStatusContext.Provider value={value}>
      {children}
    </SystemStatusContext.Provider>
  );
}

export function useSystemStatus() {
  const context = useContext(SystemStatusContext);
  if (!context) {
    throw new Error('useSystemStatus must be used within a SystemStatusProvider');
  }
  return context;
}
