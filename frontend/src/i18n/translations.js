/**
 * Central Translation Dictionary & Language Availability System for PRAHARI-NER
 *
 * Provides complete, verified application translations for English (en) and Hindi (hi),
 * state-to-language metadata, and translation resolution logic.
 */

export * from './alertTranslations.js';
export * from './uiTranslations.js';
import { translateUi } from './uiTranslations.js';

export const VERIFIED_LANGUAGES = {
  en: {
    code: 'en',
    englishName: 'English',
    nativeName: 'English',
    isSupported: true
  },
  hi: {
    code: 'hi',
    englishName: 'Hindi',
    nativeName: 'हिन्दी',
    isSupported: true
  },
  as: {
    code: 'as',
    englishName: 'Assamese',
    nativeName: 'অসমীয়া',
    isSupported: false
  },
  bn: {
    code: 'bn',
    englishName: 'Bengali',
    nativeName: 'বাংলা',
    isSupported: false
  },
  ne: {
    code: 'ne',
    englishName: 'Nepali',
    nativeName: 'नेपाली',
    isSupported: false
  }
};

export const STATE_APPLICATION_LANGUAGES = {
  "Arunachal Pradesh": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'tribal', englishName: 'Many tribal languages', nativeName: 'Multiple indigenous languages', isSupported: false }
  ],
  "Assam": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'as', englishName: 'Assamese', nativeName: 'অসমীয়া', isSupported: false },
    { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', isSupported: false },
    { code: 'brx', englishName: 'Bodo', nativeName: 'बड़ो', isSupported: false }
  ],
  "Manipur": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'mni', englishName: 'Meitei (Manipuri)', nativeName: 'ꯃꯤꯇꯩ ꯂꯣꯟ', isSupported: false }
  ],
  "Meghalaya": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'kha', englishName: 'Khasi', nativeName: 'খাসি', isSupported: false },
    { code: 'grt', englishName: 'Garo', nativeName: 'Garo', isSupported: false }
  ],
  "Mizoram": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'lus', englishName: 'Mizo', nativeName: 'Mizo', isSupported: false }
  ],
  "Nagaland": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'nag', englishName: 'Nagamese', nativeName: 'Nagamese', isSupported: false }
  ],
  "Tripura": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', isSupported: false },
    { code: 'trp', englishName: 'Kokborok', nativeName: 'Kokborok', isSupported: false }
  ],
  "Sikkim": [
    { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
    { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
    { code: 'ne', englishName: 'Nepali', nativeName: 'नेपाली', isSupported: false },
    { code: 'sip', englishName: 'Sikkimese (Bhutia)', nativeName: 'འབྲས་ལྗོངས་སྐད་', isSupported: false },
    { code: 'lep', englishName: 'Lepcha', nativeName: 'ᰛᰩᰵᰶᰣ', isSupported: false },
    { code: 'lif', englishName: 'Limbu', nativeName: 'ᤕᤠᤰᤌᤠᤧ', isSupported: false }
  ]
};

export const ALL_STATES_APPLICATION_LANGUAGES = [
  { code: 'en', englishName: 'English', nativeName: 'English', isSupported: true },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
  { code: 'as', englishName: 'Assamese', nativeName: 'অসমীয়া', isSupported: false },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', isSupported: false },
  { code: 'ne', englishName: 'Nepali', nativeName: 'नेपाली', isSupported: false }
];

export function getAvailableApplicationLanguages(stateName) {
  if (!stateName || stateName === 'All NER States' || stateName === 'All NER') {
    return ALL_STATES_APPLICATION_LANGUAGES;
  }
  return STATE_APPLICATION_LANGUAGES[stateName] || ALL_STATES_APPLICATION_LANGUAGES;
}

export const translations = {
  en: {
    common: {
      appName: "PRAHARI-NER",
      loading: "Loading PRAHARI-NER data...",
      error: "Something went wrong",
      retry: "Retry",
      tryAgain: "Try Again",
      refresh: "Refresh",
      close: "Close",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      view: "View",
      acknowledge: "Acknowledge",
      acknowledged: "Acknowledged",
      acknowledging: "Acknowledging...",
      acknowledgedDone: "✓ Acknowledged",
      active: "Active",
      status: "Status",
      online: "Online",
      offline: "Offline",
      systemOnline: "System Online",
      systemOffline: "System Offline",
      authenticatedUser: "Authenticated User",
      logout: "Logout",
      success: "Success",
      verified: "Verified",
      pending: "Pending",
      state: "State",
      district: "District",
      location: "Location",
      timestamp: "Timestamp (UTC)",
      allNerStates: "All NER States",
      selectState: "Select NER State",
      selectLanguage: "Select Language",
      applicationLanguage: "Application Language",
      englishFallback: "English fallback",
      comingSoon: "Translation coming soon",
      fullAppTranslationComingSoon: "Full application translation coming soon",
      verifyingAuth: "Verifying authentication...",
      noDataAvailable: "No data available."
    },

    navigation: {
      dashboard: "Dashboard",
      riskMap: "Risk Map",
      alerts: "Alerts",
      reports: "Reports",
      fieldReports: "Field Reports",
      response: "Response",
      settings: "Settings",
      whatIf: "What-If Analysis",
      logout: "Logout",
      profile: "Operator Profile"
    },

    dashboard: {
      title: "PRAHARI-NER Dashboard",
      activeAlerts: "Active Alerts",
      riskLevel: "Risk Level",
      currentRisk: "Current Risk",
      weather: "Weather",
      roadStatus: "Road Status",
      responsePriority: "Response Priority",
      systemStatus: "System Status",
      avoidUnstableSlopes: "Avoid unstable slopes.",
      unreachableServer: "API server is unreachable."
    },

    modelStatus: {
      title: "XGBoost Risk Model",
      modelLoaded: "MODEL LOADED",
      modelNotLoaded: "MODEL NOT LOADED",
      offlineCapable: "OFFLINE-CAPABLE",
      inference: "INFERENCE",
      features: "FEATURES",
      accuracy: "ACCURACY",
      cpuInference: "CPU Inference"
    },

    riskFactors: {
      title: "Model Factors",
      noExplanation: "No explanation available for this zone."
    },

    features: {
      rainfall_24h: "24h Rainfall",
      rainfall_72h: "72h Rainfall",
      soil_moisture: "Soil Moisture",
      slope: "Slope",
      elevation: "Elevation",
      historical_landslide_count: "Historical Landslides"
    },

    riskLevels: {
      CRITICAL: "CRITICAL",
      HIGH: "HIGH",
      MODERATE: "MODERATE",
      LOW: "LOW"
    },

    riskMap: {
      title: "North Eastern Region Risk Map",
      pageTitle: "North Eastern Region Risk Map",
      pageSubtitle: "AI-based landslide risk monitoring across the 8 North Eastern states",
      eightNerStates: "8 NER States",
      selectNerState: "Select NER State",
      applicationLanguage: "Application Language",
      allNerStates: "All NER States",
      riskIndex: "Risk Index",
      rainfall24h: "24h Rainfall",
      rainfall72h: "72h Rainfall",
      soilMoisture: "Soil Moisture",
      slope: "Slope",
      elevation: "Elevation",
      histLandslides: "Hist. Landslides",
      lastUpdated: "Last Updated",
      landslideRiskLevel: "Landslide Risk Level",
      criticalLegend: "Critical (≥75)",
      highLegend: "High (50–74)",
      moderateLegend: "Moderate (25–49)",
      lowLegend: "Low (0–24)",
      prototypeTelemetry: "PROTOTYPE / CACHED TELEMETRY",
      activeStationsMapped: "Active Stations Mapped",
      activeStationMapped: "Active Station Mapped",
      noDataForState: "No current risk data available for",
      noDataSub: "No field stations or sensor telemetry currently reporting in this state.",
      languagesOf: "Languages of",
      selectedStateLabel: "Selected State",
      languagesOfNer: "Languages of the North Eastern Region",
      languagesSub: "Regional and indigenous languages spoken across all 8 North Eastern states",
      clickToFilter: "Click to filter map to",
      languagesCount: "languages",
      languageCount: "language"
    },

    alerts: {
      title: "Active Alerts",
      systemAlertsTitle: "System Alerts",
      systemAlertsSubtitle: "Real-time early warning advisories and landslide risk notifications",
      critical: "Critical",
      high: "High",
      moderate: "Moderate",
      low: "Low",
      view: "View",
      acknowledge: "Acknowledge",
      acknowledged: "Acknowledged",
      acknowledging: "Acknowledging...",
      acknowledgedDone: "✓ Acknowledged",
      noActiveAlerts: "No active alerts.",
      allSectorsNormal: "All monitored NER risk sectors are within normal limits.",
      alertDetailsTitle: "Alert Details",
      earlyWarningDispatchLog: "Early Warning Dispatch Log",
      severityLevel: "Severity Level",
      lifecycleStatus: "Lifecycle Status",
      alertMessage: "Alert Message",
      state: "State",
      districtSector: "District / Sector",
      calculatedRiskScore: "Calculated Risk Score",
      timestamp: "Timestamp (UTC)",
      linkedParameters: "Linked Geotechnical Parameters",
      standardOperatingProtocol: "Standard Operating Protocol",
      viewOnRiskMap: "View on Risk Map",
      close: "Close",
      acknowledgeAlert: "Acknowledge Alert",
      loadingAlerts: "Loading alerts...",
      loadingSubtitle: "Retrieving latest sensor telemetry & risk notifications",
      unableToLoad: "Unable to load alerts. Please try again.",
      couldNotAcknowledge: "Could not acknowledge this alert. Please try again."
    },

    weather: {
      title: "Weather",
      rainfall24h: "24h Rainfall",
      rainfall72h: "72h Rainfall",
      temperature: "Temperature",
      forecast: "Forecast",
      heavyRainfallDetected: "Heavy rainfall detected.",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      lastUpdated: "Last Updated",
      dataSource: "Data Source",
      loadingWeather: "Loading weather...",
      weatherUnavailable: "Weather unavailable",
      conditions: {
        "Heavy Rain": "Heavy Rain",
        "Scattered Showers": "Scattered Showers",
        "Thunderstorms": "Thunderstorms",
        "Clear": "Clear",
        "Cloudy": "Cloudy",
        "Moderate Rain": "Moderate Rain"
      }
    },

    roadStatus: {
      title: "Road Status",
      open: "OPEN",
      blocked: "BLOCKED",
      atRisk: "AT RISK",
      partiallyBlocked: "PARTIALLY BLOCKED",
      unknown: "UNKNOWN",
      road: "Road",
      district: "District",
      lastUpdated: "Last Updated",
      reported: "Reported",
      noRoadData: "No road data available."
    },

    reports: {
      title: "Field Reports",
      recentFieldReports: "Recent Field Reports",
      noFieldReports: "No field reports available.",
      submitFieldReport: "Submit Field Report",
      submitSub: "Report a landslide, road blockage, or hazard. No technical knowledge required.",
      state: "State",
      selectState: "— Select State —",
      district: "District",
      selectDistrict: "— Select District —",
      selectStateFirst: "— Select a state first —",
      location: "Location / Village / Road Name",
      locationPlaceholder: "e.g. NH-15 near Bomdila",
      gpsCoordinates: "GPS Coordinates",
      gpsOptional: "(optional — improves map accuracy)",
      useMyLocation: "📍 Use My Location",
      detectingLocation: "⏳ Detecting…",
      locationAcquired: "📍 Location Acquired",
      gpsAcquired: "GPS acquired — coordinates will be stored for mapping",
      gpsDenied: "Location permission denied — report will still be submitted using State + District.",
      hazardType: "Type of Hazard",
      hazards: {
        landslide: "🏔 Landslide",
        roadBlockage: "🚧 Road Blockage",
        crack: "🪨 Slope / Ground Crack",
        flooding: "🌊 Flooding",
        debrisFlow: "⚠️ Debris / Mud Flow",
        other: "📋 Other"
      },
      hazardNames: {
        "Landslide": "Landslide",
        "Road Blockage": "Road Blockage",
        "Crack": "Slope / Ground Crack",
        "Flooding": "Flooding",
        "Debris Flow": "Debris / Mud Flow",
        "Other": "Other"
      },
      description: "What did you observe?",
      descriptionPlaceholder: "Describe what you saw — e.g. large cracks on slope above NH-13, soil movement, trees tilting, road partially blocked...",
      reporterId: "Your Name / Officer ID",
      reporterIdPlaceholder: "e.g. Rajan Tashi or officer_arunachal_04",
      submitReport: "Submit Report",
      submittingReport: "Submitting Report…",
      submittedSuccessfully: "✓ Report submitted and saved successfully. It will appear in the list below.",
      submissionFailed: "Report submission failed",
      submittedReportsTitle: "Submitted Reports",
      total: "total",
      verified: "VERIFIED",
      pending: "PENDING",
      validation: {
        stateRequired: "State is required.",
        districtRequired: "District is required.",
        locationRequired: "Location / Village / Road name is required.",
        reportTypeRequired: "Report type is required.",
        descriptionRequired: "Description is required.",
        reporterIdRequired: "Reporter ID is required."
      }
    },

    response: {
      title: "Response Protocol",
      protocolTitle: "Response Protocol",
      responsePriority: "Response Priority",
      prototypeDecisionSupport: "Prototype Decision Support",
      recommendedAction: "Recommended Action",
      noPriorities: "No immediate response priorities identified.",
      noZonePriority: "No response priority for selected zone.",
      priority: "Priority",
      location: "Location",
      risk: "Risk",
      deployTeam: "Deploy Team",
      monitor: "Monitor",
      verify: "Verify",
      immediate: "IMMEDIATE",
      high: "HIGH",
      moderate: "MODERATE"
    },

    emergency: {
      title: "Emergency Contacts",
      callWithoutInternet: "— Call without internet",
      primaryBadge: "Emergency",
      primarySub: "Police · Fire · Ambulance",
      call112: "📞 Call 112",
      ambulance: "Ambulance",
      ambulanceSub: "Emergency medical assistance",
      callAmbulance: "Call Ambulance",
      fire: "Fire",
      fireSub: "Fire and rescue emergency",
      callFire: "Call Fire",
      police: "Police",
      policeSub: "Police emergency assistance",
      callPolice: "Call Police",
      publicHelplinesTitle: "🚨 24x7 Emergency Helplines (No Login Required)",
      directHelplinesTitle: "Direct Emergency Contacts (No Login Required)"
    },

    dataSourceStatus: {
      title: "Data Sources",
      weather: "Weather Telemetry",
      seismic: "Seismic Telemetry",
      soil_moisture: "Soil Moisture Sensors",
      geological: "Geological Surveys",
      livePublic: "LIVE PUBLIC",
      cachedPublic: "CACHED PUBLIC",
      simulation: "SIMULATION"
    },

    manualPrediction: {
      title: "Manual XGBoost Prediction",
      rainfall24h: "24h Rainfall",
      rainfall72h: "72h Rainfall",
      soilMoisture: "Soil Moisture",
      slope: "Slope",
      elevation: "Elevation",
      histLandslides: "Hist. Landslides",
      predictRisk: "Run XGBoost Prediction",
      predicting: "Predicting...",
      predictionResult: "Prediction Result",
      riskScore: "Risk Score:",
      model: "Model:",
      probability: "Probability:"
    },

    settings: {
      title: "System Settings",
      subtitle: "Manage your account details, disaster alert channels, and monitoring preferences.",
      operatorProfile: "Operator Profile",
      authenticatedUser: "Authenticated User",
      authProvider: "Authentication Provider",
      firebaseAuth: "Firebase Authentication",
      languageAndRegion: "Language & Regional Settings",
      languageAndRegionSub: "Select your state and preferred application language across PRAHARI-NER.",
      earlyWarningAlerts: "Early Warning Alerts",
      criticalSms: "Critical Risk SMS Dispatch",
      criticalSmsSub: "Automatically broadcast high-priority alerts to field personnel.",
      thresholdAlerts: "Real-Time Risk Threshold Alerts",
      thresholdAlertsSub: "Trigger UI banners when rainfall exceeds 100mm/24h.",
      intelligenceEngine: "Intelligence Engine Information",
      predictionModel: "Landslide Prediction Model",
      modelName: "XGBoost Classifier v1.0",
      inferenceEngine: "Inference Engine",
      inferenceEngineVal: "FastAPI Server-Side ML Pipeline",
      targetRegion: "Target Region",
      targetRegionVal: "North Eastern Region (NER), India",
      offlineResilience: "Offline Resilience",
      offlineResilienceVal: "Enabled (Cached Satellite & GIS Fallback)",
      saveChanges: "Save Changes",
      savedNotice: "Preferences saved successfully."
    },

    landing: {
      title: "PRAHARI-NER",
      subtitle: "AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region of India",
      monitor: "Monitor",
      predict: "Predict",
      map: "Map",
      alert: "Alert",
      verify: "Verify",
      respond: "Respond",
      signIn: "Sign In / Access System",
      languageSelectLabel: "Application Language"
    },

    login: {
      title: "PRAHARI-NER",
      subtitle: "AI-Based Landslide Early Warning & Risk Monitoring",
      continueWithGoogle: "Continue with Google",
      signingIn: "Signing in...",
      orPhoneOtp: "Or Sign in with Phone OTP",
      mobileNumber: "Mobile Phone Number",
      phonePlaceholder: "Enter 10-digit number (e.g. 9876543210)",
      phoneHelp: "Enter any 10-digit Indian phone number. You can change it anytime before sending.",
      sendSmsOtp: "Send SMS OTP",
      sendingSmsOtp: "Sending SMS OTP...",
      verifyPhoneNumber: "Verify Phone Number",
      enterOtpCode: "Enter the 6-digit verification code sent to:",
      verifyAndContinue: "Verify & Continue",
      verifyingOtp: "Verifying OTP...",
      resendOtp: "Resend SMS OTP",
      resendingOtp: "Resending...",
      editPhoneNumber: "← Edit Phone Number",
      firebaseNotConfigured: "Firebase Authentication Not Configured",
      firebaseNotConfiguredSub: "Add the Firebase configuration to frontend/.env or Render environment variables to activate real authentication.",
      recaptchaExpired: "reCAPTCHA challenge expired. Please click Send SMS OTP again.",
      googleCancelled: "Sign-in cancelled. Popup was closed before completing.",
      googleBlocked: "Popup was blocked by your browser. Please allow popups for this site.",
      networkError: "Network error during authentication. Please check your internet connection.",
      authFailed: "Authentication failed. Please try again.",
      enterTenDigits: "Please enter your 10-digit mobile number.",
      completeTenDigits: "Please enter a complete 10-digit Indian mobile number (+91XXXXXXXXXX).",
      validIndianNumber: "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.",
      recaptchaResetNotice: "reCAPTCHA security challenge reset. Please verify your phone number and click Send SMS OTP again.",
      invalidPhoneFormat: "Invalid phone number format. Please check the 10-digit number and try again.",
      tooManyAttempts: "Too many attempts. Please wait a few minutes before trying again.",
      smsQuotaExceeded: "Daily SMS quota exceeded in Firebase project. Please use Google Sign-In.",
      invalidOtpCode: "Invalid OTP code. Please check and enter the 6-digit code again.",
      otpExpired: "OTP code has expired. Please request a new code.",
      otpVerificationFailed: "OTP verification failed."
    },

    loading: {
      default: "Loading PRAHARI-NER data...",
      alerts: "Loading alerts...",
      weather: "Loading weather...",
      reports: "Loading reports...",
      map: "Loading map...",
      response: "Loading response protocols...",
      dataSources: "Loading data sources..."
    },

    errors: {
      default: "Something went wrong",
      unableToConnect: "Unable to connect",
      backendUnavailable: "Backend unavailable. Please ensure the FastAPI server is running.",
      failedToLoad: "Failed to load application data."
    },

    whatIf: {
      title: "What-If Impact Analysis",
      subtitle: "Simulate the potential impact of a landslide at a selected risk location.",
      selectLocationTitle: "Select Risk Location",
      selectState: "NER State",
      selectDistrict: "District",
      selectRiskZone: "Risk Zone",
      allStates: "All NER States",
      selectZonePlaceholder: "— Select Risk Zone —",
      noVerifiedZones: "No verified risk zones available.",
      selectedLocation: "Selected Location",
      state: "State",
      district: "District",
      location: "Location",
      riskLevel: "Risk Level",
      riskScore: "Risk Score",
      runAnalysis: "Run What-If Analysis",
      runningAnalysis: "Simulating Impact Scenario...",
      simulatedScenario: "SIMULATED IMPACT SCENARIO",
      scenarioDescription: "A landslide is simulated at the selected risk zone.",
      disclaimer: "This is a scenario analysis based on available data.",
      potentialImpact: "Potential Impact",
      roadAccess: "Road Access",
      nearbySettlements: "Nearby Settlements",
      criticalInfrastructure: "Critical Infrastructure",
      emergencyAccess: "Emergency Access",
      potentiallyAffected: "Potentially Affected",
      potentiallyRestricted: "Potentially Restricted",
      potentiallyDelayed: "Potentially Delayed",
      emergencyRouteNote: "Emergency response may require an alternative route.",
      availableRoadInfo: "Available road information:",
      status: "Status",
      distance: "Distance",
      roadDataUnavailable: "Road data unavailable",
      settlementDataUnavailable: "Settlement data unavailable",
      criticalInfrastructureUnavailable: "Critical infrastructure data unavailable",
      noVerifiedDataAvailable: "No verified data available",
      basedOnAvailableData: "Based on available data",
      responsePriority: "SIMULATED RESPONSE PRIORITY",
      scenarioDataQuality: "SCENARIO DATA QUALITY",
      dataQualityHigh: "HIGH",
      dataQualityMedium: "MEDIUM",
      dataQualityLimited: "LIMITED",
      impactFlowTitle: "Simulated Impact Cascade Flow",
      flowStep1: "Landslide Scenario",
      flowStep2: "Road Access",
      flowStep3: "Settlement Access",
      flowStep4: "Emergency Access",
      flowStep5: "Response Priority",
      mapTitle: "Scenario Impact Map",
      mapCoordsUnavailable: "Location coordinates unavailable. Map impact markers cannot be displayed.",
      loadingAnalysis: "Loading Impact Analysis...",
      analysisFailed: "Unable to run impact analysis. Please try again.",
      close: "Close",
      whatIfButton: "What If?",
      closeWhatIf: "Close What-If Analysis",
      viewDetails: "View Details",
      roadsIdentified: "Roads Identified",
      priorityCalculation: "Simulated Priority Index",
      scoringModel: "Dynamic Priority Formula",
      scoringExplanation: "Base Zone Risk",
      verifiedTelemetry: "Verified Telemetry Sources",
      sourceRiskZones: "XGBoost Trained Geological Slope Risk",
      sourceRoads: "PWD / NHAI Road Corridor Telemetry",
      uncatalogedSectors: "Unmonitored Sectors",
      sourceSettlementsPending: "Village settlement census pending",
      sourceInfraPending: "Hospital / helipad telemetry pending",
      promptToRun: "Select a risk location above and click 'Analyze What-If' to simulate scenario impacts.",
      selectNerState: "Select NER State",
      selectNerStatePlaceholder: "Select NER State",
      selectLocationPlaceholder: "Select Location",
      selectLocationLabel: "District / Zone",
      selectStateFirst: "Select NER State first",
      analyzeWhatIf: "Analyze What-If",
      analyzing: "Analyzing What-If...",
      currentRisk: "Current Risk",
      whatCouldHappen: "What could happen if a landslide occurs here?",
      mapLocationUnavailable: "Map location unavailable for this zone.",
      unavailableForLocation: "What-If analysis is unavailable for this location."
    }
  },

  hi: {
    common: {
      appName: "प्रहरी-एनईआर",
      loading: "PRAHARI-NER डेटा लोड हो रहा है...",
      error: "कुछ गलत हो गया",
      retry: "पुनः प्रयास करें",
      tryAgain: "पुनः प्रयास करें",
      refresh: "ताज़ा करें",
      close: "बंद करें",
      save: "सहेजें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      view: "देखें",
      acknowledge: "स्वीकार करें",
      acknowledged: "स्वीकार किया गया",
      acknowledging: "स्वीकार किया जा रहा है...",
      acknowledgedDone: "✓ स्वीकृत",
      active: "सक्रिय",
      status: "स्थिति",
      online: "ऑनलाइन",
      offline: "ऑफ़लाइन",
      systemOnline: "सिस्टम ऑनलाइन",
      systemOffline: "सिस्टम ऑफ़लाइन",
      authenticatedUser: "प्रमाणित उपयोगकर्ता",
      logout: "लॉगआउट",
      success: "सफलता",
      verified: "सत्यापित",
      pending: "लंबित",
      state: "राज्य",
      district: "जिला",
      location: "स्थान",
      timestamp: "समय टिकट (UTC)",
      allNerStates: "सभी एनईआर राज्य",
      selectState: "एनईआर राज्य चुनें",
      selectLanguage: "भाषा चुनें",
      applicationLanguage: "एप्लिकेशन भाषा",
      englishFallback: "अंग्रेजी फ़ॉलबैक",
      comingSoon: "अनुवाद जल्द आ रहा है",
      fullAppTranslationComingSoon: "पूर्ण एप्लिकेशन अनुवाद जल्द आ रहा है",
      verifyingAuth: "प्रमाणीकरण की पुष्टि हो रही है...",
      noDataAvailable: "कोई डेटा उपलब्ध नहीं है।"
    },

    navigation: {
      dashboard: "डैशबोर्ड",
      riskMap: "जोखिम मानचित्र",
      alerts: "चेतावनियाँ",
      reports: "रिपोर्ट",
      fieldReports: "क्षेत्रीय रिपोर्ट",
      response: "प्रतिक्रिया",
      settings: "सेटिंग्स",
      whatIf: "संभावित प्रभाव विश्लेषण",
      logout: "लॉगआउट",
      profile: "ऑपरेटर प्रोफ़ाइल"
    },

    dashboard: {
      title: "PRAHARI-NER डैशबोर्ड",
      activeAlerts: "सक्रिय चेतावनियाँ",
      riskLevel: "जोखिम स्तर",
      currentRisk: "वर्तमान जोखिम",
      weather: "मौसम",
      roadStatus: "सड़क की स्थिति",
      responsePriority: "प्रतिक्रिया प्राथमिकता",
      systemStatus: "सिस्टम स्थिति",
      avoidUnstableSlopes: "अस्थिर ढलानों से बचें।",
      unreachableServer: "एपीआई सर्वर से संपर्क नहीं हो पा रहा है।"
    },

    modelStatus: {
      title: "XGBoost जोखिम मॉडल",
      modelLoaded: "मॉडल लोड हो गया",
      modelNotLoaded: "मॉडल लोड नहीं हुआ",
      offlineCapable: "ऑफ़लाइन सक्षम",
      inference: "अनुमान (INFERENCE)",
      features: "सुविधाएँ (FEATURES)",
      accuracy: "सटीकता (ACCURACY)",
      cpuInference: "सीपीयू अनुमान"
    },

    riskFactors: {
      title: "मॉडल के प्रमुख कारक",
      noExplanation: "इस क्षेत्र के लिए कोई मॉडल व्याख्या उपलब्ध नहीं है।"
    },

    features: {
      rainfall_24h: "24 घंटे की वर्षा",
      rainfall_72h: "72 घंटे की वर्षा",
      soil_moisture: "मिट्टी की नमी",
      slope: "ढलान",
      elevation: "ऊंचाई",
      historical_landslide_count: "ऐतिहासिक भूस्खलन"
    },

    riskLevels: {
      CRITICAL: "अत्यंत गंभीर",
      HIGH: "उच्च",
      MODERATE: "मध्यम",
      LOW: "कम"
    },

    riskMap: {
      title: "उत्तर पूर्वी क्षेत्र जोखिम मानचित्र",
      pageTitle: "उत्तर पूर्वी क्षेत्र जोखिम मानचित्र",
      pageSubtitle: "8 उत्तर पूर्वी राज्यों में एआई-आधारित भूस्खलन जोखिम की निगरानी",
      eightNerStates: "8 एनईआर राज्य",
      selectNerState: "एनईआर राज्य चुनें",
      applicationLanguage: "एप्लिकेशन भाषा",
      allNerStates: "सभी एनईआर राज्य",
      riskIndex: "जोखिम सूचकांक",
      rainfall24h: "24 घंटे की वर्षा",
      rainfall72h: "72 घंटे की वर्षा",
      soilMoisture: "मिट्टी की नमी",
      slope: "ढलान",
      elevation: "ऊंचाई",
      histLandslides: "ऐतिहासिक भूस्खलन",
      lastUpdated: "अंतिम अद्यतन",
      landslideRiskLevel: "भूस्खलन जोखिम स्तर",
      criticalLegend: "अत्यंत गंभीर (≥75)",
      highLegend: "उच्च (50–74)",
      moderateLegend: "मध्यम (25–49)",
      lowLegend: "कम (0–24)",
      prototypeTelemetry: "प्रोटोटाइप / कैश्ड टेलीमेट्री",
      activeStationsMapped: "सक्रिय निगरानी केंद्र",
      activeStationMapped: "सक्रिय निगरानी केंद्र",
      noDataForState: "के लिए कोई वर्तमान जोखिम डेटा उपलब्ध नहीं है:",
      noDataSub: "इस राज्य में वर्तमान में कोई फील्ड स्टेशन या सेंसर टेलीमेट्री रिपोर्ट नहीं कर रहा है।",
      languagesOf: "की भाषाएँ",
      selectedStateLabel: "चयनित राज्य",
      languagesOfNer: "उत्तर पूर्वी क्षेत्र की भाषाएँ",
      languagesSub: "सभी 8 उत्तर पूर्वी राज्यों में बोली जाने वाली क्षेत्रीय और स्वदेशी भाषाएँ",
      clickToFilter: "मानचित्र को फ़िल्टर करने के लिए क्लिक करें:",
      languagesCount: "भाषाएँ",
      languageCount: "भाषा"
    },

    alerts: {
      title: "सक्रिय चेतावनियाँ",
      systemAlertsTitle: "सिस्टम चेतावनियाँ",
      systemAlertsSubtitle: "वास्तविक समय पूर्व चेतावनी सलाह और भूस्खलन जोखिम सूचनाएं",
      critical: "अत्यंत गंभीर",
      high: "उच्च",
      moderate: "मध्यम",
      low: "कम",
      view: "देखें",
      acknowledge: "स्वीकार करें",
      acknowledged: "स्वीकार किया गया",
      acknowledging: "स्वीकार किया जा रहा है...",
      acknowledgedDone: "✓ स्वीकृत",
      noActiveAlerts: "कोई सक्रिय चेतावनी नहीं है।",
      allSectorsNormal: "निगरानी किए गए सभी एनईआर जोखिम क्षेत्र सामान्य सीमा के भीतर हैं।",
      alertDetailsTitle: "चेतावनी विवरण",
      earlyWarningDispatchLog: "पूर्व चेतावनी प्रेषण लॉग",
      severityLevel: "गंभीरता स्तर",
      lifecycleStatus: "स्थिति",
      alertMessage: "चेतावनी संदेश",
      state: "राज्य",
      districtSector: "जिला / क्षेत्र",
      calculatedRiskScore: "गणना किया गया जोखिम स्कोर",
      timestamp: "समय टिकट (UTC)",
      linkedParameters: "संबंधित भू-तकनीकी पैरामीटर",
      standardOperatingProtocol: "मानक संचालन प्रोटोकॉल (SOP)",
      viewOnRiskMap: "जोखिम मानचित्र पर देखें",
      close: "बंद करें",
      acknowledgeAlert: "चेतावनी स्वीकार करें",
      loadingAlerts: "चेतावनियाँ लोड हो रही हैं...",
      loadingSubtitle: "नवीनतम सेंसर टेलीमेट्री और जोखिम सूचनाएं प्राप्त की जा रही हैं",
      unableToLoad: "चेतावनियाँ लोड करने में असमर्थ। कृपया पुनः प्रयास करें।",
      couldNotAcknowledge: "इस चेतावनी को स्वीकार नहीं किया जा सका। कृपया पुनः प्रयास करें।"
    },

    weather: {
      title: "मौसम",
      rainfall24h: "24 घंटे की वर्षा",
      rainfall72h: "72 घंटे की वर्षा",
      temperature: "तापमान",
      forecast: "पूर्वानुमान",
      heavyRainfallDetected: "भारी वर्षा दर्ज की गई है।",
      humidity: "आर्द्रता",
      windSpeed: "हवा की गति",
      lastUpdated: "अंतिम अद्यतन",
      dataSource: "डेटा स्रोत",
      loadingWeather: "मौसम लोड हो रहा है...",
      weatherUnavailable: "मौसम डेटा अनुपलब्ध",
      conditions: {
        "Heavy Rain": "भारी वर्षा",
        "Scattered Showers": "छिटपुट बौछारें",
        "Thunderstorms": "गरज के साथ वर्षा",
        "Clear": "साफ मौसम",
        "Cloudy": "बादल छाए रहेंगे",
        "Moderate Rain": "मध्यम वर्षा"
      }
    },

    roadStatus: {
      title: "सड़क की स्थिति",
      open: "खुली है (OPEN)",
      blocked: "अवरुद्ध (BLOCKED)",
      atRisk: "जोखिम में (AT RISK)",
      partiallyBlocked: "आंशिक रूप से अवरुद्ध",
      unknown: "अज्ञात",
      road: "सड़क",
      district: "जिला",
      lastUpdated: "अंतिम अद्यतन",
      reported: "रिपोर्ट की गई",
      noRoadData: "कोई सड़क डेटा उपलब्ध नहीं है।"
    },

    reports: {
      title: "क्षेत्रीय रिपोर्ट",
      recentFieldReports: "हाल की क्षेत्रीय रिपोर्ट",
      noFieldReports: "कोई क्षेत्रीय रिपोर्ट उपलब्ध नहीं है।",
      submitFieldReport: "क्षेत्रीय रिपोर्ट जमा करें",
      submitSub: "भूस्खलन, सड़क अवरोध या खतरे की रिपोर्ट करें। किसी तकनीकी ज्ञान की आवश्यकता नहीं है।",
      state: "राज्य",
      selectState: "— राज्य चुनें —",
      district: "जिला",
      selectDistrict: "— जिला चुनें —",
      selectStateFirst: "— पहले एक राज्य चुनें —",
      location: "स्थान / गाँव / सड़क का नाम",
      locationPlaceholder: "उदा. बोमडिला के पास एनएच-15",
      gpsCoordinates: "जीपीएस निर्देशांक",
      gpsOptional: "(वैकल्पिक — मानचित्र सटीकता में सुधार करता है)",
      useMyLocation: "📍 मेरे स्थान का उपयोग करें",
      detectingLocation: "⏳ पता लगाया जा रहा है…",
      locationAcquired: "📍 स्थान प्राप्त हो गया",
      gpsAcquired: "जीपीएस प्राप्त हुआ — निर्देशांक मानचित्रण के लिए संग्रहीत किए जाएंगे",
      gpsDenied: "स्थान अनुमति अस्वीकृत — रिपोर्ट अभी भी राज्य + जिले का उपयोग करके जमा की जाएगी।",
      hazardType: "खतरे का प्रकार",
      hazards: {
        landslide: "🏔 भूस्खलन (Landslide)",
        roadBlockage: "🚧 सड़क अवरोध (Road Blockage)",
        crack: "🪨 ढलान / जमीन में दरार",
        flooding: "🌊 बाढ़ (Flooding)",
        debrisFlow: "⚠️ मलबा / कीचड़ बहाव",
        other: "📋 अन्य (Other)"
      },
      hazardNames: {
        "Landslide": "भूस्खलन",
        "Road Blockage": "सड़क अवरोध",
        "Crack": "ढलान / जमीन में दरार",
        "Flooding": "बाढ़",
        "Debris Flow": "मलबा / कीचड़ बहाव",
        "Other": "अन्य"
      },
      description: "आपने क्या देखा? विवरण दें",
      descriptionPlaceholder: "जो आपने देखा उसका वर्णन करें — उदा. एनएच-13 के ऊपर ढलान पर बड़ी दरारें, मिट्टी का खिसकना, पेड़ों का झुकना, सड़क का आंशिक अवरोध...",
      reporterId: "आपका नाम / अधिकारी आईडी",
      reporterIdPlaceholder: "उदा. राजन ताशी या officer_arunachal_04",
      submitReport: "रिपोर्ट जमा करें",
      submittingReport: "रिपोर्ट जमा की जा रही है…",
      submittedSuccessfully: "✓ रिपोर्ट सफलतापूर्वक जमा और सहेज ली गई है। यह नीचे दी गई सूची में दिखाई देगी।",
      submissionFailed: "रिपोर्ट जमा करने में विफल",
      submittedReportsTitle: "जमा की गई रिपोर्ट",
      total: "कुल",
      verified: "सत्यापित",
      pending: "लंबित",
      validation: {
        stateRequired: "राज्य चुनना अनिवार्य है।",
        districtRequired: "जिला चुनना अनिवार्य है।",
        locationRequired: "स्थान / गाँव / सड़क का नाम आवश्यक है।",
        reportTypeRequired: "खतरे का प्रकार चुनना अनिवार्य है।",
        descriptionRequired: "विवरण देना अनिवार्य है।",
        reporterIdRequired: "रिपोर्टर आईडी / नाम अनिवार्य है।"
      }
    },

    response: {
      title: "प्रतिक्रिया प्रोटोकॉल",
      protocolTitle: "प्रतिक्रिया प्रोटोकॉल",
      responsePriority: "प्रतिक्रिया प्राथमिकता",
      prototypeDecisionSupport: "प्रोटोटाइप निर्णय सहायता",
      recommendedAction: "अनुशंसित कार्रवाई",
      noPriorities: "कोई तत्काल प्रतिक्रिया प्राथमिकता नहीं पहचानी गई।",
      noZonePriority: "चयनित क्षेत्र के लिए कोई प्रतिक्रिया प्राथमिकता नहीं है।",
      priority: "प्राथमिकता",
      location: "स्थान",
      risk: "जोखिम",
      deployTeam: "टीम तैनात करें",
      monitor: "निगरानी रखें",
      verify: "सत्यापित करें",
      immediate: "तत्काल",
      high: "उच्च",
      moderate: "मध्यम"
    },

    emergency: {
      title: "आपातकालीन संपर्क",
      callWithoutInternet: "— बिना इंटरनेट के कॉल करें",
      primaryBadge: "आपातकाल",
      primarySub: "पुलिस · अग्निशमन · एम्बुलेंस",
      call112: "📞 कॉल करें 112",
      ambulance: "एम्बुलेंस",
      ambulanceSub: "आपातकालीन चिकित्सा सहायता",
      callAmbulance: "कॉल एम्बुलेंस",
      fire: "अग्निशमन",
      fireSub: "अग्नि एवं बचाव आपातकाल",
      callFire: "कॉल अग्निशमन",
      police: "पुलिस",
      policeSub: "पुलिस आपातकालीन सहायता",
      callPolice: "कॉल पुलिस",
      publicHelplinesTitle: "🚨 24x7 आपातकालीन हेल्पलाइन (लॉगिन की आवश्यकता नहीं)",
      directHelplinesTitle: "सीधे आपातकालीन संपर्क (लॉगिन की आवश्यकता नहीं)"
    },

    dataSourceStatus: {
      title: "डेटा स्रोत",
      weather: "मौसम टेलीमेट्री",
      seismic: "भूकंपीय टेलीमेट्री",
      soil_moisture: "मृदा नमी सेंसर",
      geological: "भूवैज्ञानिक सर्वेक्षण",
      livePublic: "लाइव सार्वजनिक",
      cachedPublic: "कैश्ड सार्वजनिक",
      simulation: "सिमुलेशन"
    },

    manualPrediction: {
      title: "मैन्युअल XGBoost भविष्यवाणी",
      rainfall24h: "24 घंटे की वर्षा",
      rainfall72h: "72 घंटे की वर्षा",
      soilMoisture: "मिट्टी की नमी",
      slope: "ढलान",
      elevation: "ऊंचाई",
      histLandslides: "ऐतिहासिक भूस्खलन",
      predictRisk: "XGBoost भविष्यवाणी चलाएं",
      predicting: "भविष्यवाणी की जा रही है...",
      predictionResult: "भविष्यवाणी परिणाम",
      riskScore: "जोखिम स्कोर:",
      model: "मॉडल:",
      probability: "संभावना (Probability):"
    },

    settings: {
      title: "सिस्टम सेटिंग्स",
      subtitle: "अपने खाते का विवरण, आपदा चेतावनी चैनल और निगरानी प्राथमिकताएं प्रबंधित करें।",
      operatorProfile: "ऑपरेटर प्रोफ़ाइल",
      authenticatedUser: "प्रमाणित उपयोगकर्ता",
      authProvider: "प्रमाणीकरण प्रदाता",
      firebaseAuth: "फायरबेस प्रमाणीकरण",
      languageAndRegion: "भाषा एवं क्षेत्रीय सेटिंग्स",
      languageAndRegionSub: "संपूर्ण PRAHARI-NER में अपना राज्य और पसंदीदा एप्लिकेशन भाषा चुनें।",
      earlyWarningAlerts: "पूर्व चेतावनी सूचनाएं",
      criticalSms: "गंभीर जोखिम एसएमएस प्रेषण",
      criticalSmsSub: "फील्ड कर्मियों को स्वचालित रूप से उच्च-प्राथमिकता अलर्ट प्रसारित करें।",
      thresholdAlerts: "वास्तविक समय जोखिम सीमा सूचनाएं",
      thresholdAlertsSub: "जब 24 घंटे में वर्षा 100 मिमी से अधिक हो जाए तो यूआई बैनर प्रदर्शित करें।",
      intelligenceEngine: "इंटेलिजेंस इंजन सूचना",
      predictionModel: "भूस्खलन भविष्यवाणी मॉडल",
      modelName: "XGBoost क्लासिफायर v1.0",
      inferenceEngine: "अनुमान इंजन",
      inferenceEngineVal: "FastAPI सर्वर-साइड एमएल पाइपलाइन",
      targetRegion: "लक्षित क्षेत्र",
      targetRegionVal: "उत्तर पूर्वी क्षेत्र (NER), भारत",
      offlineResilience: "ऑफ़लाइन लचीलापन",
      offlineResilienceVal: "सक्षम (कैश्ड उपग्रह और जीआईएस फ़ॉलबैक)",
      saveChanges: "परिवर्तन सहेजें",
      savedNotice: "प्राथमिकताएं सफलतापूर्वक सहेजी गईं।"
    },

    landing: {
      title: "PRAHARI-NER",
      subtitle: "भारत के उत्तर पूर्वी क्षेत्र के लिए एआई-आधारित पूर्व चेतावनी और भूस्खलन जोखिम निगरानी प्रणाली",
      monitor: "निगरानी",
      predict: "पूर्वानुमान",
      map: "मानचित्र",
      alert: "चेतावनी",
      verify: "सत्यापन",
      respond: "प्रतिक्रिया",
      signIn: "साइन इन / सिस्टम एक्सेस",
      languageSelectLabel: "एप्लिकेशन भाषा"
    },

    login: {
      title: "PRAHARI-NER",
      subtitle: "एआई-आधारित भूस्खलन पूर्व चेतावनी और जोखिम निगरानी",
      continueWithGoogle: "गूगल के साथ जारी रखें",
      signingIn: "साइन इन हो रहा है...",
      orPhoneOtp: "या फ़ोन ओटीपी से साइन इन करें",
      mobileNumber: "मोबाइल फ़ोन नंबर",
      phonePlaceholder: "10 अंकों का नंबर दर्ज करें (उदा. 9876543210)",
      phoneHelp: "कोई भी 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें। आप भेजने से पहले इसे कभी भी बदल सकते हैं।",
      sendSmsOtp: "एसएमएस ओटीपी भेजें",
      sendingSmsOtp: "एसएमएस ओटीपी भेजा जा रहा है...",
      verifyPhoneNumber: "फ़ोन नंबर सत्यापित करें",
      enterOtpCode: "इस नंबर पर भेजा गया 6 अंकों का सत्यापन कोड दर्ज करें:",
      verifyAndContinue: "सत्यापित करें और आगे बढ़ें",
      verifyingOtp: "ओटीपी सत्यापित हो रहा है...",
      resendOtp: "एसएमएस ओटीपी पुनः भेजें",
      resendingOtp: "पुनः भेजा जा रहा है...",
      editPhoneNumber: "← फ़ोन नंबर बदलें",
      firebaseNotConfigured: "फायरबेस प्रमाणीकरण कॉन्फ़िगर नहीं है",
      firebaseNotConfiguredSub: "वास्तविक प्रमाणीकरण सक्रिय करने के लिए frontend/.env में फायरबेस कॉन्फ़िगरेशन जोड़ें।",
      recaptchaExpired: "reCAPTCHA चुनौती समाप्त हो गई। कृपया पुनः एसएमएस ओटीपी भेजें पर क्लिक करें।",
      googleCancelled: "साइन-इन रद्द कर दिया गया। पॉपअप पूरा होने से पहले बंद कर दिया गया था।",
      googleBlocked: "आपके ब्राउज़र द्वारा पॉपअप अवरुद्ध कर दिया गया था। कृपया इस साइट के लिए पॉपअप की अनुमति दें।",
      networkError: "प्रमाणीकरण के दौरान नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
      authFailed: "प्रमाणीकरण विफल रहा। कृपया पुनः प्रयास करें।",
      enterTenDigits: "कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें।",
      completeTenDigits: "कृपया पूरा 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें (+91XXXXXXXXXX)।",
      validIndianNumber: "कृपया 6, 7, 8, या 9 से शुरू होने वाला एक वैध भारतीय मोबाइल नंबर दर्ज करें।",
      recaptchaResetNotice: "reCAPTCHA सुरक्षा रीसेट हो गई है। कृपया अपना नंबर जांचें और पुनः एसएमएस ओटीपी भेजें पर क्लिक करें।",
      invalidPhoneFormat: "अमान्य फ़ोन नंबर प्रारूप। कृपया 10 अंकों का नंबर जांचें और पुनः प्रयास करें।",
      tooManyAttempts: "बहुत सारे प्रयास। कृपया पुनः प्रयास करने से पहले कुछ मिनट प्रतीक्षा करें।",
      smsQuotaExceeded: "फायरबेस प्रोजेक्ट में दैनिक एसएमएस कोटा समाप्त हो गया। कृपया गूगल साइन-इन का उपयोग करें।",
      invalidOtpCode: "अमान्य ओटीपी कोड। कृपया 6 अंकों का कोड जांचें और पुनः दर्ज करें।",
      otpExpired: "ओटीपी कोड समाप्त हो गया है। कृपया एक नया कोड अनुरोध करें।",
      otpVerificationFailed: "ओटीपी सत्यापन विफल रहा।"
    },

    loading: {
      default: "PRAHARI-NER डेटा लोड हो रहा है...",
      alerts: "चेतावनियाँ लोड हो रही हैं...",
      weather: "मौसम डेटा लोड हो रहा है...",
      reports: "रिपोर्ट लोड हो रही हैं...",
      map: "मानचित्र लोड हो रहा है...",
      response: "प्रतिक्रिया प्रोटोकॉल लोड हो रहे हैं...",
      dataSources: "डेटा स्रोत लोड हो रहे हैं..."
    },

    errors: {
      default: "कुछ गलत हो गया",
      unableToConnect: "कनेक्ट करने में असमर्थ",
      backendUnavailable: "बैकएंड अनुपलब्ध है। कृपया सुनिश्चित करें कि FastAPI सर्वर चल रहा है।",
      failedToLoad: "एप्लिकेशन डेटा लोड करने में विफल।"
    },

    whatIf: {
      title: "संभावित प्रभाव विश्लेषण (What-If)",
      subtitle: "चयनित जोखिम स्थान पर भूस्खलन के संभावित प्रभाव का अनुकरण करें।",
      selectLocationTitle: "जोखिम स्थान का चयन करें",
      selectState: "एनईआर राज्य",
      selectDistrict: "जिला",
      selectRiskZone: "जोखिम क्षेत्र",
      allStates: "सभी एनईआर राज्य",
      selectZonePlaceholder: "— जोखिम क्षेत्र चुनें —",
      noVerifiedZones: "कोई सत्यापित जोखिम क्षेत्र उपलब्ध नहीं है।",
      selectedLocation: "चयनित स्थान",
      state: "राज्य",
      district: "जिला",
      location: "स्थान",
      riskLevel: "जोखिम स्तर",
      riskScore: "जोखिम स्कोर",
      runAnalysis: "संभावित प्रभाव विश्लेषण चलाएं",
      runningAnalysis: "प्रभाव परिदृश्य का अनुकरण किया जा रहा है...",
      simulatedScenario: "सिम्युलेटेड प्रभाव परिदृश्य",
      scenarioDescription: "चयनित जोखिम क्षेत्र में भूस्खलन का अनुकरण किया गया है।",
      disclaimer: "यह उपलब्ध आंकड़ों पर आधारित एक परिदृश्य विश्लेषण है।",
      potentialImpact: "संभावित प्रभाव",
      roadAccess: "सड़क संपर्क",
      nearbySettlements: "आस-पास की बस्तियां",
      criticalInfrastructure: "महत्वपूर्ण बुनियादी ढांचा",
      emergencyAccess: "आपातकालीन पहुंच",
      potentiallyAffected: "संभावित रूप से प्रभावित",
      potentiallyRestricted: "संभावित रूप से प्रतिबंधित",
      potentiallyDelayed: "संभावित रूप से विलंबित",
      emergencyRouteNote: "आपातकालीन प्रतिक्रिया के लिए वैकल्पिक मार्ग की आवश्यकता हो सकती है।",
      availableRoadInfo: "उपलब्ध सड़क जानकारी:",
      status: "स्थिति",
      distance: "दूरी",
      roadDataUnavailable: "सड़क डेटा अनुपलब्ध",
      settlementDataUnavailable: "बस्ती डेटा अनुपलब्ध",
      criticalInfrastructureUnavailable: "महत्वपूर्ण बुनियादी ढांचा डेटा अनुपलब्ध",
      noVerifiedDataAvailable: "कोई सत्यापित डेटा उपलब्ध नहीं",
      basedOnAvailableData: "उपलब्ध आंकड़ों पर आधारित",
      responsePriority: "सिम्युलेटेड प्रतिक्रिया प्राथमिकता",
      scenarioDataQuality: "परिदृश्य डेटा गुणवत्ता",
      dataQualityHigh: "उच्च",
      dataQualityMedium: "मध्यम",
      dataQualityLimited: "सीमित",
      impactFlowTitle: "सिम्युलेटेड प्रभाव प्रवाह",
      flowStep1: "भूस्खलन परिदृश्य",
      flowStep2: "सड़क संपर्क",
      flowStep3: "बस्ती पहुंच",
      flowStep4: "आपातकालीन पहुंच",
      flowStep5: "प्रतिक्रिया प्राथमिकता",
      mapTitle: "परिदृश्य प्रभाव मानचित्र",
      mapCoordsUnavailable: "स्थान के निर्देशांक अनुपलब्ध हैं। मानचित्र प्रभाव मार्कर प्रदर्शित नहीं किए जा सकते।",
      loadingAnalysis: "प्रभाव विश्लेषण लोड हो रहा है...",
      analysisFailed: "प्रभाव विश्लेषण चलाने में असमर्थ। कृपया पुनः प्रयास करें।",
      close: "बंद करें",
      whatIfButton: "संभावित प्रभाव? (What If?)",
      closeWhatIf: "संभावित प्रभाव विश्लेषण बंद करें",
      viewDetails: "विवरण देखें",
      roadsIdentified: "पहचानी गई सड़कें",
      priorityCalculation: "सिम्युलेटेड प्राथमिकता सूचकांक",
      scoringModel: "गतिशील प्राथमिकता सूत्र",
      scoringExplanation: "आधार क्षेत्र जोखिम",
      verifiedTelemetry: "सत्यापित टेलीमेट्री स्रोत",
      sourceRiskZones: "XGBoost प्रशिक्षित भूवैज्ञानिक ढलान जोखिम",
      sourceRoads: "पीडब्ल्यूडी / एनएचएआई सड़क गलियारा टेलीमेट्री",
      uncatalogedSectors: "गैर-निगरानी वाले क्षेत्र",
      sourceSettlementsPending: "ग्राम बस्ती जनगणना लंबित",
      sourceInfraPending: "अस्पताल / हेलीपैड टेलीमेट्री लंबित",
      promptToRun: "परिदृश्य प्रभावों को अनुकरण करने के लिए ऊपर एक जोखिम स्थान चुनें और 'संभावित प्रभाव विश्लेषण करें' पर क्लिक करें।",
      selectNerState: "एनईआर राज्य चुनें",
      selectNerStatePlaceholder: "एनईआर राज्य चुनें",
      selectLocationPlaceholder: "स्थान चुनें",
      selectLocationLabel: "जिला / क्षेत्र",
      selectStateFirst: "पहले एनईआर राज्य चुनें",
      analyzeWhatIf: "संभावित प्रभाव विश्लेषण करें (Analyze What-If)",
      analyzing: "संभावित प्रभाव का विश्लेषण हो रहा है...",
      currentRisk: "वर्तमान जोखिम",
      whatCouldHappen: "यदि यहाँ भूस्खलन होता है तो क्या प्रभाव हो सकता है?",
      mapLocationUnavailable: "इस क्षेत्र के लिए मानचित्र स्थान अनुपलब्ध है।",
      unavailableForLocation: "इस स्थान के लिए संभावित प्रभाव विश्लेषण अनुपलब्ध है।"
    }
  }
};

/**
 * Resolves a dot-notation key (e.g., "navigation.dashboard") in the given language dictionary.
 * Falls back to English, then returns the fallback or path.
 */
export function resolveTranslation(langCode, path, defaultText) {
  if (!path) return '';

  const getFromObj = (obj, p) => {
    if (!obj || typeof obj !== 'object') return undefined;
    const parts = p.split('.');
    let cur = obj;
    for (const part of parts) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[part];
    }
    return typeof cur === 'string' ? cur : undefined;
  };

  // 1. Try selected language
  const targetObj = translations[langCode] || translations.en;
  let res = getFromObj(targetObj, path);
  if (res !== undefined) return res;

  // 2. Try English fallback if not already English
  if (langCode !== 'en') {
    res = getFromObj(translations.en, path);
    if (res !== undefined) return res;
  }

  // 3. Try flat uiTranslations for legacy compatibility
  const flatRes = translateUi(path, langCode);
  if (flatRes && flatRes !== path) return flatRes;

  // 4. Return defaultText if supplied, otherwise path
  return defaultText !== undefined ? defaultText : path;
}
