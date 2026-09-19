import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  translations,
  resolveTranslation,
  getTranslatedAlert,
  getAvailableApplicationLanguages,
  VERIFIED_LANGUAGES
} from '../i18n/translations.js';

const LanguageContext = createContext(null);

const STORAGE_STATE_KEY = 'prahari_ner_selected_state';
const STORAGE_LANG_KEY = 'prahari_ner_selected_lang';

export function LanguageProvider({ children }) {
  // State selection: defaults to saved or "All NER States"
  const [selectedState, setSelectedState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_STATE_KEY) || "All NER States";
    } catch {
      return "All NER States";
    }
  });

  // Application language selection: defaults to saved or "en" (English)
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_LANG_KEY) || "en";
    } catch {
      return "en";
    }
  });

  // Persist selectedState
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATE_KEY, selectedState);
    } catch (e) {
      console.warn('Could not save state preference:', e);
    }
  }, [selectedState]);

  // Persist selectedLanguage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, selectedLanguage);
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  }, [selectedLanguage]);

  // Compute available application languages dynamically based on selectedState
  const availableLanguages = useMemo(() => {
    return getAvailableApplicationLanguages(selectedState);
  }, [selectedState]);

  // Translate UI label helper supporting dot notation
  const t = useCallback((path, defaultText) => {
    const res = resolveTranslation(selectedLanguage, path, defaultText);
    if (!res && import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation for key "${path}" in language "${selectedLanguage}"`);
    }
    return res;
  }, [selectedLanguage]);

  // Translate alert helper
  const translateAlert = useCallback((alert) => {
    return getTranslatedAlert(alert, selectedLanguage);
  }, [selectedLanguage]);

  // Current language metadata
  const currentLanguageInfo = useMemo(() => {
    const verified = VERIFIED_LANGUAGES[selectedLanguage];
    if (verified) return verified;

    const found = availableLanguages.find(l => l.code === selectedLanguage);
    if (found) return found;

    return {
      code: selectedLanguage,
      englishName: selectedLanguage,
      nativeName: selectedLanguage,
      isSupported: false
    };
  }, [selectedLanguage, availableLanguages]);

  const isAppLanguageSupported = useCallback((code) => {
    return code === 'en' || code === 'hi';
  }, []);

  const value = useMemo(() => ({
    selectedState,
    setSelectedState,
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
    currentLanguageInfo,
    isAppLanguageSupported,
    t,
    translateAlert
  }), [
    selectedState,
    selectedLanguage,
    availableLanguages,
    currentLanguageInfo,
    isAppLanguageSupported,
    t,
    translateAlert
  ]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
