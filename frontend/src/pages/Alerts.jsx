import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import AlertPanel from '../components/AlertPanel';
import api from '../services/api';
import LoadingState from '../components/LoadingState';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts()
      .then(res => setAlerts(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4">System Alerts</h1>
        {loading ? <LoadingState /> : <AlertPanel alerts={alerts} />}
      </div>
    </PageLayout>
  );
}
