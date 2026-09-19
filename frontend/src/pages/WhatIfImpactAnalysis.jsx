import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { Compass, Info, AlertCircle, ShieldCheck, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import WhatIfLocationSelector from '../components/whatif/WhatIfLocationSelector';
import WhatIfScenario from '../components/whatif/WhatIfScenario';
import WhatIfImpactCards from '../components/whatif/WhatIfImpactCards';
import WhatIfImpactFlow from '../components/whatif/WhatIfImpactFlow';
import WhatIfPriority from '../components/whatif/WhatIfPriority';
import WhatIfDataQuality from '../components/whatif/WhatIfDataQuality';
import WhatIfMap from '../components/whatif/WhatIfMap';

export default function WhatIfImpactAnalysis() {
  const { t, selectedState } = useLanguage();
  const location = useLocation();

  const [zones, setZones] = useState([]);
  const [loadingZones, setLoadingZones] = useState(true);
  
  // Location-first state selection
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);

  // Simulation state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState(null);

  const resultsRef = useRef(null);

  // Fetch real risk zones on mount
  useEffect(() => {
    let mounted = true;
    setLoadingZones(true);
    api.getRiskZones()
      .then((data) => {
        if (mounted) {
          const list = Array.isArray(data) ? data : [];
          setZones(list);
          
          // Check if we navigated here with a selectedZone in state (e.g. from Dashboard Map)
          if (location.state?.selectedZone) {
            const z = location.state.selectedZone;
            const match = list.find(item => item.id === z.id) || z;
            setSelectedStateFilter(match.state);
            setSelectedZone(match);
            
            // Note: We don't automatically trigger analysis. The user will click "Analyze What-If"
          } 
          // Otherwise, if global state is already an NER state, default to it
          else if (selectedState && selectedState !== 'All NER States' && selectedState !== 'All NER') {
            setSelectedStateFilter(selectedState);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load risk zones:', err);
        if (mounted) {
          setError(t('whatIf.analysisFailed', 'Unable to load risk zones. Please check backend connection.'));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoadingZones(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [t, selectedState, location.state]);

  // Execute What-If simulation using the actual selected zone ID
  const handleRunAnalysis = async () => {
    if (!selectedZone?.id) {
      setError(t('whatIf.selectStateFirst', 'Please select a valid risk location first.'));
      return;
    }

    setLoadingAnalysis(true);
    setError(null);

    try {
      // Call existing POST /api/risk/what-if with real selected zone ID
      const res = await api.runWhatIfAnalysis(selectedZone.id);
      setAnalysisResult(res);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Error running What-If analysis:', err);
      setError(
        err.response?.data?.detail ||
        t('whatIf.analysisFailed', 'Unable to run impact analysis. Please try again.')
      );
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const getRiskBadgeClass = (level) => {
    switch ((level || '').toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MODERATE':
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 pb-12">
        {/* Main Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {t('whatIf.title', 'What-If Impact Analysis')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {t('whatIf.subtitle', 'Simulate the potential impact of a landslide at a selected risk location.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>PRAHARI-NER DSS</span>
            </span>
          </div>
        </div>

        {/* Decision-Support Banner */}
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 space-y-1">
            <p className="font-bold">
              {t('whatIf.disclaimer', 'This is a scenario analysis based on available data.')}
            </p>
            <p className="text-blue-800 leading-relaxed font-medium">
              {t('whatIf.promptToRun', 'Select a risk location above and click "Analyze What-If" to simulate scenario impacts.')}
            </p>
          </div>
        </div>

        {/* 1. Location-First Selector Component */}
        <WhatIfLocationSelector
          zones={zones}
          selectedStateFilter={selectedStateFilter}
          setSelectedStateFilter={(st) => {
            setSelectedStateFilter(st);
            setSelectedZone(null);
            setAnalysisResult(null); // Clear previous results when state changes
            setError(null);
          }}
          selectedZone={selectedZone}
          setSelectedZone={(z) => {
            setSelectedZone(z);
            setAnalysisResult(null); // Clear previous results when location changes
            setError(null);
          }}
          onRunAnalysis={handleRunAnalysis}
          loadingAnalysis={loadingAnalysis}
          error={error}
        />

        {/* Loading Spinner */}
        {loadingAnalysis && (
          <div className="p-12 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col items-center justify-center space-y-3">
            <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-bold text-gray-900">
              {t('whatIf.analyzing', 'Analyzing What-If Scenario...')}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {selectedZone ? `${selectedZone.name}, ${selectedZone.state}` : ''}
            </div>
          </div>
        )}

        {/* 2. Analysis Results Section */}
        {analysisResult && !loadingAnalysis && (
          <div ref={resultsRef} className="space-y-6 pt-2">
            {/* Prominent Header displaying exact selected location */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                  {t('whatIf.selectedLocation', 'Selected Location')}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg sm:text-xl font-black">
                    {analysisResult.zone?.name || selectedZone?.name}
                  </span>
                  <span className="text-sm text-indigo-200 font-semibold">
                    ({analysisResult.zone?.state || selectedZone?.state})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-indigo-300 uppercase font-semibold block">
                    {t('whatIf.currentRisk', 'Current Risk')}
                  </span>
                  <span className="text-sm font-bold">
                    {analysisResult.zone?.current_risk_score ?? selectedZone?.current_risk_score} / 100
                  </span>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${getRiskBadgeClass(analysisResult.zone?.current_risk_level || selectedZone?.current_risk_level)}`}>
                  {t(`riskLevels.${analysisResult.zone?.current_risk_level || selectedZone?.current_risk_level}`, analysisResult.zone?.current_risk_level || selectedZone?.current_risk_level)}
                </span>
              </div>
            </div>

            {/* Simulated Scenario Header */}
            <WhatIfScenario
              scenario={analysisResult.scenario || analysisResult.scenario_description}
              zone={analysisResult.zone || selectedZone}
            />

            {/* Map showing the exact selected location & verified road buffer */}
            <WhatIfMap
              selectedZone={analysisResult.zone || selectedZone}
              analysis={analysisResult}
            />

            {/* 4 Impact Cards: Road, Settlements, Infrastructure, Emergency Access */}
            <WhatIfImpactCards analysis={analysisResult} />

            {/* Cascading Impact Cascade Flow */}
            <WhatIfImpactFlow analysis={analysisResult} />

            {/* Response Priority & Data Quality Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhatIfPriority
                priority={analysisResult.response_priority}
                zone={analysisResult.zone || selectedZone}
              />
              <WhatIfDataQuality
                dataQuality={analysisResult.data_quality}
                roadImpact={analysisResult.road_impact || analysisResult.road_access}
              />
            </div>
          </div>
        )}

        {/* Selected Location Map Preview before simulation (if zone selected and not yet analyzed) */}
        {selectedZone && !analysisResult && !loadingAnalysis && (
          <div className="space-y-4">
            <WhatIfMap
              selectedZone={selectedZone}
              analysis={null}
            />
          </div>
        )}

        {/* Empty State / Instruction Prompt */}
        {!selectedZone && !loadingAnalysis && (
          <div className="p-8 sm:p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {t('whatIf.selectLocationTitle', 'Select Risk Location')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-medium">
              {t('whatIf.selectStateFirst', 'Select an NER state, then select the target risk zone.')}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
