import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ResponsePriority({ priorities, selectedZone }) {
  const { t, selectedLanguage } = useLanguage();

  const getPriorityLabel = (p) => {
    switch ((p || '').toUpperCase()) {
      case 'IMMEDIATE':
        return t('response.immediate', 'IMMEDIATE');
      case 'HIGH':
        return t('response.high', 'HIGH');
      case 'MODERATE':
        return t('response.moderate', 'MODERATE');
      default:
        return p;
    }
  };

  const translateActionText = (action) => {
    if (!action) return '';
    if (selectedLanguage === 'hi') {
      return action
        .replace(/Deploy emergency inspection team/gi, 'आपातकालीन निरीक्षण दल तैनात करें')
        .replace(/Deploy team/gi, 'टीम तैनात करें')
        .replace(/Monitor slope displacement and alert downstream communities/gi, 'ढलान विस्थापन की निगरानी करें और निचले इलाकों के समुदायों को सचेत करें')
        .replace(/Monitor/gi, 'निगरानी रखें')
        .replace(/Verify/gi, 'सत्यापित करें');
    }
    return action;
  };

  if (!priorities || priorities.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-gray-600" />
          {t('response.responsePriority', 'Response Priority')}
        </h2>
        <div className="text-sm text-gray-500 text-center">
          {t('response.noPriorities', 'No immediate response priorities identified.')}
        </div>
      </div>
    );
  }

  // Show priority for selected zone if available, otherwise just show all
  const displayPriorities = selectedZone 
    ? priorities.filter(p => p.location === selectedZone.name)
    : priorities;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          {t('response.responsePriority', 'Response Priority')}
        </h2>
        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
          {t('response.prototypeDecisionSupport', 'Prototype Decision Support')}
        </span>
      </div>
      
      {displayPriorities.length > 0 ? (
        <div className="flex flex-col gap-4">
          {displayPriorities.map((priority, index) => (
            <div key={index} className={`p-3 rounded-lg border-l-4 ${
              priority.priority === 'IMMEDIATE' ? 'border-l-red-600 bg-red-50' : 'border-l-orange-500 bg-orange-50'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-gray-900">{priority.location}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                  priority.priority === 'IMMEDIATE' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'
                }`}>
                  {getPriorityLabel(priority.priority)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{priority.reason}</p>
              <div className="bg-white p-2 rounded border border-gray-200 mt-2">
                <span className="text-xs font-semibold text-gray-700 block mb-1">
                  {t('response.recommendedAction', 'Recommended Action')}:
                </span>
                <p className="text-xs text-gray-800">
                  {translateActionText(priority.recommended_action)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center">
          {t('response.noZonePriority', 'No response priority for selected zone.')}
        </div>
      )}
    </div>
  );
}
