import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Bell, User, Cpu, Globe, CheckCircle2 } from 'lucide-react';
import { NER_STATES } from '../data/nerStates';

export default function Settings() {
  const { user } = useAuth();
  const {
    selectedState,
    setSelectedState,
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
    t
  } = useLanguage();

  const [criticalSms, setCriticalSms] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSave = () => {
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t('settings.title', 'System Settings')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('settings.subtitle', 'Manage your account details, disaster alert channels, and monitoring preferences.')}
          </p>
        </div>

        {saveNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('settings.savedNotice', 'Preferences saved successfully.')}</span>
          </div>
        )}

        {/* Language & Regional Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('settings.languageAndRegion', 'Language & Regional Settings')}
              </h2>
              <p className="text-xs text-gray-500">
                {t('settings.languageAndRegionSub', 'Select your state and preferred application language across PRAHARI-NER.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-state-select" className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('common.selectState', 'Select NER State')}
              </label>
              <select
                id="settings-state-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="All NER States">{t('common.allNerStates', 'All NER States')}</option>
                {NER_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="settings-lang-select" className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('common.applicationLanguage', 'Application Language')}
              </label>
              <select
                id="settings-lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full text-sm font-semibold border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.englishName}){!lang.isSupported ? ` — ${t('common.comingSoon', 'Coming soon')}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Authenticated Account Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('settings.operatorProfile', 'Operator Profile')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="block text-xs font-semibold text-gray-500 uppercase">
                {t('settings.authenticatedUser', 'Authenticated User')}
              </span>
              <span className="font-mono text-gray-800 font-medium">
                {user?.email || user?.phoneNumber || t('navigation.profile', 'Disaster Response Operator')}
              </span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="block text-xs font-semibold text-gray-500 uppercase">
                {t('settings.authProvider', 'Authentication Provider')}
              </span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" /> {t('settings.firebaseAuth', 'Firebase Authentication')}
              </span>
            </div>
          </div>
        </div>

        {/* Disaster Warning Preferences */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('settings.earlyWarningAlerts', 'Early Warning Alerts')}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{t('settings.criticalSms', 'Critical Risk SMS Dispatch')}</p>
                <p className="text-xs text-gray-500">{t('settings.criticalSmsSub', 'Automatically broadcast high-priority alerts to field personnel.')}</p>
              </div>
              <input
                type="checkbox"
                checked={criticalSms}
                onChange={(e) => setCriticalSms(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
              >
              </input>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{t('settings.thresholdAlerts', 'Real-Time Risk Threshold Alerts')}</p>
                <p className="text-xs text-gray-500">{t('settings.thresholdAlertsSub', 'Trigger UI banners when rainfall exceeds 100mm/24h.')}</p>
              </div>
              <input
                type="checkbox"
                checked={highRiskAlerts}
                onChange={(e) => setHighRiskAlerts(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
              >
              </input>
            </div>
          </div>
        </div>

        {/* System Intelligence Architecture */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t('settings.intelligenceEngine', 'Intelligence Engine Information')}
            </h2>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">{t('settings.predictionModel', 'Landslide Prediction Model')}</span>
              <span className="font-semibold text-gray-800">{t('settings.modelName', 'XGBoost Classifier v1.0')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">{t('settings.inferenceEngine', 'Inference Engine')}</span>
              <span className="font-semibold text-gray-800">{t('settings.inferenceEngineVal', 'FastAPI Server-Side ML Pipeline')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-500">{t('settings.targetRegion', 'Target Region')}</span>
              <span className="font-semibold text-gray-800">{t('settings.targetRegionVal', 'North Eastern Region (NER), India')}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">{t('settings.offlineResilience', 'Offline Resilience')}</span>
              <span className="font-semibold text-emerald-700">{t('settings.offlineResilienceVal', 'Enabled (Cached Satellite & GIS Fallback)')}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {t('settings.saveChanges', 'Save Changes')}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
