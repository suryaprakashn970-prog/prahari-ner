import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import ResponsePriority from '../components/ResponsePriority';
import api from '../services/api';
import LoadingState from '../components/LoadingState';

export default function Response() {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getResponsePriorities()
      .then(res => setPriorities(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Response Protocol</h1>
        {loading ? <LoadingState /> : <ResponsePriority priorities={priorities} />}
      </div>
    </PageLayout>
  );
}
