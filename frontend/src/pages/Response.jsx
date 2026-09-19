import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import ResponsePriority from '../components/ResponsePriority';
import api from '../services/api';
import LoadingState from '../components/LoadingState';
import { useLanguage } from '../context/LanguageContext';

export default function Response() {
  const { t } = useLanguage();
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
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {t('response.protocolTitle', 'Response Protocol')}
        </h1>
        {loading ? (
          <LoadingState message={t('loading.response', 'Loading response protocols...')} />
        ) : (
          <ResponsePriority priorities={priorities} />
        )}
      </div>
    </PageLayout>
  );
}
