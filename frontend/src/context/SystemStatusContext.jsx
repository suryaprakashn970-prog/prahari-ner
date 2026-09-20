import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_URL, checkHealthWithRetry } from '../services/api';

const SystemStatusContext = createContext({
  status: 'checking', // 'checking' | 'online' | 'offline'
  isOnline: false,
  isChecking: true,
  isOffline: false,
  healthData: null,
  apiUrl: API_URL,
  checkHealth: async () => {},
});

export function SystemStatusProvider({ children }) {
  const [status, setStatus] = useState('checking'); // starts in 'checking'
  const [healthData, setHealthData] = useState(null);
  const isCheckingRef = useRef(false);

  const checkHealth = useCallback(async (retries = 2, delayMs = 1200) => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setStatus('checking');

    try {
      const result = await checkHealthWithRetry(retries, delayMs);
      if (result.status === 'ok') {
        setStatus('online');
        setHealthData(result.data);
      } else {
        setStatus('offline');
        setHealthData(null);
      }
    } catch (err) {
      console.warn('Health check failed:', err);
      setStatus('offline');
      setHealthData(null);
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkHealth(2, 1000);

    // Periodic heartbeat every 45s
    const interval = setInterval(() => {
      checkHealth(1, 1000);
    }, 45000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  const value = {
    status,
    isOnline: status === 'online',
    isChecking: status === 'checking',
    isOffline: status === 'offline',
    healthData,
    apiUrl: API_URL,
    checkHealth: () => checkHealth(2, 1200),
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
