/**
 * UI Translations for PRAHARI-NER
 *
 * Provides localized user-facing UI labels, emergency contacts, severity badges,
 * and operational headers. Numbers, telemetry values, and database schemas remain intact.
 */

export const UI_TRANSLATIONS = {
  // ── Navigation & Common ──
  appTitle: {
    en: "PRAHARI-NER",
    hi: "प्रहरी-एनईआर"
  },
  selectNerState: {
    en: "Select NER State",
    hi: "एनईआर राज्य चुनें"
  },
  applicationLanguage: {
    en: "Application Language",
    hi: "एप्लिकेशन भाषा"
  },
  allNerStates: {
    en: "All NER States",
    hi: "सभी एनईआर राज्य"
  },
  englishFallback: {
    en: "English fallback",
    hi: "अंग्रेजी फ़ॉलबैक"
  },
  translationComingSoon: {
    en: "Translation coming soon",
    hi: "अनुवाद जल्द आ रहा है"
  },

  // ── Emergency Contacts ──
  emergencyContactsTitle: {
    en: "Emergency Contacts",
    hi: "आपातकालीन संपर्क"
  },
  emergencyCallWithoutInternet: {
    en: "— Call without internet",
    hi: "— बिना इंटरनेट के कॉल करें"
  },
  emergencyPrimaryBadge: {
    en: "Emergency",
    hi: "आपातकाल"
  },
  emergencyPrimarySub: {
    en: "Police · Fire · Ambulance",
    hi: "पुलिस · अग्निशमन · एम्बुलेंस"
  },
  call112: {
    en: "📞 Call 112",
    hi: "📞 कॉल करें 112"
  },
  ambulance: {
    en: "Ambulance",
    hi: "एम्बुलेंस"
  },
  ambulanceSub: {
    en: "Emergency medical assistance",
    hi: "आपातकालीन चिकित्सा सहायता"
  },
  callAmbulance: {
    en: "Call Ambulance",
    hi: "कॉल एम्बुलेंस"
  },
  fire: {
    en: "Fire",
    hi: "अग्निशमन"
  },
  fireSub: {
    en: "Fire and rescue emergency",
    hi: "अग्नि एवं बचाव आपातकाल"
  },
  callFire: {
    en: "Call Fire",
    hi: "कॉल अग्निशमन"
  },
  police: {
    en: "Police",
    hi: "पुलिस"
  },
  policeSub: {
    en: "Police emergency assistance",
    hi: "पुलिस आपातकालीन सहायता"
  },
  callPolice: {
    en: "Call Police",
    hi: "कॉल पुलिस"
  },

  // ── Status & Risk Summary ──
  systemStatus: {
    en: "System Status",
    hi: "सिस्टम स्थिति"
  },
  systemOnline: {
    en: "System Online",
    hi: "सिस्टम ऑनलाइन"
  },
  systemOffline: {
    en: "System Offline",
    hi: "सिस्टम ऑफ़लाइन"
  },
  currentRisk: {
    en: "Current Risk",
    hi: "वर्तमान जोखिम"
  },
  critical: {
    en: "CRITICAL",
    hi: "अत्यंत गंभीर"
  },
  high: {
    en: "HIGH",
    hi: "उच्च"
  },
  moderate: {
    en: "MODERATE",
    hi: "मध्यम"
  },
  low: {
    en: "LOW",
    hi: "कम"
  },
  avoidUnstableSlopes: {
    en: "Avoid unstable slopes.",
    hi: "अस्थिर ढलानों से बचें।"
  },
  highRisk: {
    en: "High Risk",
    hi: "उच्च जोखिम"
  },

  // ── Active Alerts ──
  activeAlerts: {
    en: "Active Alerts",
    hi: "सक्रिय चेतावनियां"
  },
  acknowledged: {
    en: "Acknowledged",
    hi: "स्वीकृत"
  },
  noActiveAlerts: {
    en: "No active alerts.",
    hi: "कोई सक्रिय चेतावनी नहीं है।"
  },
  allSectorsNormal: {
    en: "All monitored NER risk sectors are within normal limits.",
    hi: "सभी निगरानी किए गए एनईआर जोखिम क्षेत्र सामान्य सीमा के भीतर हैं।"
  },
  view: {
    en: "View",
    hi: "देखें"
  },
  acknowledge: {
    en: "Acknowledge",
    hi: "स्वीकार करें"
  },
  acknowledging: {
    en: "Acknowledging...",
    hi: "स्वीकार किया जा रहा है..."
  },
  acknowledgedDone: {
    en: "✓ Acknowledged",
    hi: "✓ स्वीकृत"
  },
  alertDetailsTitle: {
    en: "Alert Details",
    hi: "चेतावनी विवरण"
  },
  earlyWarningDispatchLog: {
    en: "Early Warning Dispatch Log",
    hi: "पूर्व चेतावनी प्रेषण लॉग"
  },
  severityLevel: {
    en: "Severity Level",
    hi: "गंभीरता स्तर"
  },
  lifecycleStatus: {
    en: "Lifecycle Status",
    hi: "स्थिति"
  },
  alertMessage: {
    en: "Alert Message",
    hi: "चेतावनी संदेश"
  },
  state: {
    en: "State",
    hi: "राज्य"
  },
  districtSector: {
    en: "District / Sector",
    hi: "जिला / क्षेत्र"
  },
  calculatedRiskScore: {
    en: "Calculated Risk Score",
    hi: "गणना किया गया जोखिम स्कोर"
  },
  timestamp: {
    en: "Timestamp (UTC)",
    hi: "समय टिकट"
  },
  linkedParameters: {
    en: "Linked Geotechnical Parameters",
    hi: "संबंधित भू-तकनीकी पैरामीटर"
  },
  standardOperatingProtocol: {
    en: "Standard Operating Protocol",
    hi: "मानक संचालन प्रोटोकॉल"
  },
  viewOnRiskMap: {
    en: "View on Risk Map",
    hi: "जोखिम मानचित्र पर देखें"
  },
  close: {
    en: "Close",
    hi: "बंद करें"
  },
  acknowledgeAlert: {
    en: "Acknowledge Alert",
    hi: "चेतावनी स्वीकार करें"
  },

  // ── Weather & Warnings ──
  weather: {
    en: "Weather",
    hi: "मौसम"
  },
  rainfall24h: {
    en: "24h Rainfall",
    hi: "24 घंटे की वर्षा"
  },
  rainfall72h: {
    en: "72h Rainfall",
    hi: "72 घंटे की वर्षा"
  },
  temperature: {
    en: "Temperature",
    hi: "तापमान"
  },
  forecast: {
    en: "Forecast",
    hi: "पूर्वानुमान"
  },
  heavyRainfallDetected: {
    en: "Heavy rainfall detected.",
    hi: "भारी वर्षा दर्ज की गई है।"
  },

  // ── Field Reports ──
  fieldReports: {
    en: "Field Reports",
    hi: "क्षेत्रीय रिपोर्ट"
  },
  recentFieldReports: {
    en: "Recent Field Reports",
    hi: "हाल की क्षेत्रीय रिपोर्ट"
  },
  noFieldReports: {
    en: "No field reports available.",
    hi: "कोई क्षेत्रीय रिपोर्ट उपलब्ध नहीं है।"
  },
  description: {
    en: "Description",
    hi: "विवरण"
  },
  submitReport: {
    en: "Submit Report",
    hi: "रिपोर्ट सबमिट करें"
  },

  // ── Response Priority ──
  responsePriority: {
    en: "Response Priority",
    hi: "प्रतिक्रिया प्राथमिकता"
  },
  recommendedAction: {
    en: "Recommended Action",
    hi: "अनुशंसित कार्रवाई"
  },
  noPriorities: {
    en: "No immediate response priorities identified.",
    hi: "कोई तत्काल प्रतिक्रिया प्राथमिकता नहीं पहचानी गई।"
  },

  // ── Road Status ──
  roadStatus: {
    en: "Road Status",
    hi: "सड़क स्थिति"
  }
};

/**
 * Translates a UI key with fallback to English.
 *
 * @param {string} key - The UI key to look up
 * @param {string} langCode - Language code ('en', 'hi', etc.)
 * @returns {string} The localized string or English fallback
 */
export function translateUi(key, langCode = 'en') {
  if (!key) return '';
  const entry = UI_TRANSLATIONS[key];
  if (!entry) return key;

  if (entry[langCode]) {
    return entry[langCode];
  }
  return entry.en || key;
}
