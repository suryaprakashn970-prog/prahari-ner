import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SystemStatusProvider } from './context/SystemStatusContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RiskMapPage from './pages/RiskMapPage';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Response from './pages/Response';
import Settings from './pages/Settings';
import WhatIfImpactAnalysis from './pages/WhatIfImpactAnalysis';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SystemStatusProvider>
          <BrowserRouter>
        <Routes>
          {/* Public routes accessible without authentication */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected application routes requiring real Firebase authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk-map"
            element={
              <ProtectedRoute>
                <RiskMapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/response"
            element={
              <ProtectedRoute>
                <Response />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/what-if"
            element={
              <ProtectedRoute>
                <WhatIfImpactAnalysis />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
        </SystemStatusProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
