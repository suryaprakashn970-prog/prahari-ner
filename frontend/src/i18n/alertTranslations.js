/**
 * Verified Alert Translations for PRAHARI-NER
 *
 * Canonical alerts from sensors and backend dispatch mapped to verified localized translations.
 * If a translation is not verified for a specific language, the system gracefully falls back
 * to the canonical English alert and flags isFallback = true.
 */

export const ALERT_MESSAGE_TRANSLATIONS = {
  // 1. Critical Rainfall & Slope Advisory (Tawang / Arunachal Pradesh & general)
  "High rainfall expected. Avoid unstable slopes. Field verification required.": {
    en: "High rainfall expected. Avoid unstable slopes. Field verification required.",
    hi: "भारी वर्षा की संभावना है। अस्थिर ढलानों से बचें। क्षेत्रीय सत्यापन आवश्यक है।",
    as: "প্ৰচুৰ বৰষুণৰ সম্ভাৱনা। অস্থিৰ ঢাল এৰক। ক্ষেত্ৰ পৰীক্ষণ প্ৰয়োজন।",
    bn: "ভারী বৃষ্টির সম্ভাবনা। অস্থির ঢাল এড়িয়ে চলুন। মাঠ পর্যায়ের যাচাই প্রয়োজন।",
    ne: "भारी वर्षाको सम्भावना छ। अस्थिर ढलानहरूबाट बच्नुहोस्। क्षेत्रीय प्रमाणीकरण आवश्यक छ।"
  },

  // 2. High Road Blockage Advisory (Shillong / Meghalaya NH-6 & general)
  "Road blockages reported on NH-6 due to recent slides.": {
    en: "Road blockages reported on NH-6 due to recent slides.",
    hi: "हाल ही में हुए भूस्खलन के कारण एनएच-6 पर सड़क अवरोध की सूचना है।",
    as: "শেহতীয়া ভূমিস্খলনৰ বাবে এনএইচ-৬ত পথ অৱৰোধৰ খবৰ পোৱা গৈছে।",
    bn: "সাম্প্রতিক ভূমিধসের কারণে এনএইচ-৬ এ সড়ক অবরোধের খবর পাওয়া গেছে।",
    ne: "हालैको पहिरोका कारण एनएच-६ मा सडक अवरुद्ध भएको रिपोर्ट गरिएको छ।"
  },

  // 3. Tawang Sector Specific
  "High rainfall in Tawang sector. Unstable slope warning.": {
    en: "High rainfall in Tawang sector. Unstable slope warning.",
    hi: "तवांग सेक्टर में भारी बारिश। अस्थिर ढलान चेतावनी।",
    as: "তাৱাং খণ্ডত প্ৰচুৰ বৰষুণ। অস্থিৰ ঢালৰ সতৰ্কবাণী।",
    bn: "তাওয়াং সেক্টরে ভারী বৃষ্টি। অস্থির ঢাল সতর্কতা।",
    ne: "तवाङ क्षेत्रमा भारी वर्षा। अस्थिर ढलान चेतावनी।"
  },

  // 4. Shillong Bypass Specific
  "Slope saturation high on Shillong bypass.": {
    en: "Slope saturation high on Shillong bypass.",
    hi: "शिलांग बाईपास पर ढलान संतृप्ति उच्च है।",
    as: "শ্বিলং বাইপাছত ঢাল সংপৃক্ততা উচ্চ।",
    bn: "শিলং বাইপাসে ঢাল সম্পৃক্ততা উচ্চ।",
    ne: "शिलोङ बाइपासमा ढलान संतृप्ति उच्च छ।"
  },

  // 5. Flash Landslide Advisory
  "Heavy rainfall detected in multiple slope areas. Increased risk of flash landslides.": {
    en: "Heavy rainfall detected in multiple slope areas. Increased risk of flash landslides.",
    hi: "कई ढलान क्षेत्रों में भारी वर्षा दर्ज की गई। अचानक भूस्खलन का जोखिम बढ़ा।",
    as: "বহু ঢালু অঞ্চলত প্ৰচুৰ বৰষুণ ধৰা পৰিছে। আকস্মিক ভূমিস্খলনৰ আশংকা বৃদ্ধি পালে।",
    bn: "একাধিক ঢাল এলাকায় ভারী বৃষ্টিপাত শনাক্ত করা হয়েছে। আকস্মিক ভূমিধসের ঝুঁকি বেড়েছে।",
    ne: "धेरै ढलान क्षेत्रहरूमा भारी वर्षा पत्ता लाग्यो। अचानक पहिरोको जोखिम बढ्यो।"
  },

  // 6. Moderate Risk Weather Advisory
  "Moderate risk alert. Monitor weather conditions closely.": {
    en: "Moderate risk alert. Monitor weather conditions closely.",
    hi: "मध्यम जोखिम चेतावनी। मौसम की स्थिति पर बारीकी से नज़र रखें।",
    as: "মধ্যমীয়া আশংকাৰ সতৰ্কবাণী। বতৰৰ অৱস্থা নিবিড়ভাৱে নিৰীক্ষণ কৰক।",
    bn: "মাঝারি ঝুঁকির সতর্কতা। আবহাওয়ার অবস্থা নিবিড়ভাবে পর্যবেক্ষণ করুন।",
    ne: "मध्यम जोखिम चेतावनी। मौसमको अवस्था नजिकबाट निगरानी गर्नुहोस्।"
  }
};

export const PROTOCOL_TRANSLATIONS = {
  critical: {
    en: "Immediate evacuation advisory and field reconnaissance required. Notify district disaster management authority (DDMA) and road maintenance units.",
    hi: "तत्काल निकासी सलाह और क्षेत्रीय टोह की आवश्यकता है। जिला आपदा प्रबंधन प्राधिकरण (DDMA) और सड़क रखरखाव इकाइयों को सूचित करें।",
    as: "অবিলম্বে স্থান খালী কৰাৰ নিৰ্দেশনা আৰু ক্ষেত্ৰ পুনৰীক্ষণ প্ৰয়োজন। জিলা দুৰ্যোগ ব্যৱস্থাপনা প্ৰাধিকৰণ (DDMA) আৰু পথ ৰক্ষণাবেক্ষণ ইউনিটক অৱগত কৰক।",
    bn: "অবিলম্বে এলাকা ত্যাগের পরামর্শ এবং মাঠ জরিপ প্রয়োজন। জেলা দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ (DDMA) এবং সড়ক রক্ষণাবেক্ষণ ইউনিটকে অবহিত করুন।",
    ne: "तत्काल खाली गर्ने सल्लाह र क्षेत्रीय पुनरावलोकन आवश्यक छ। जिल्ला विपद् व्यवस्थापन प्राधिकरण (DDMA) र सडक मर्मत एकाइहरूलाई सूचित गर्नुहोस्।"
  },
  standard: {
    en: "Monitor slope saturation telemetry and notify field spotters along critical transit arteries.",
    hi: "ढलान संतृप्ति टेलीमेट्री की निगरानी करें और महत्वपूर्ण पारगमन धमनियों के साथ फील्ड स्पॉटर्स को सूचित करें।",
    as: "ঢাল সংপৃক্ততা টেলিমেট্ৰি নিৰীক্ষণ কৰক আৰু গুৰুত্বপূৰ্ণ ট্ৰেনজিট পথসমূহত ফিল্ড স্পটাৰসকলক অৱগত কৰক।",
    bn: "ঢাল সম্পৃক্ততা টেলিমেট্রি পর্যবেক্ষণ করুন এবং গুরুত্বপূর্ণ ট্রানজিট ধমনী বরাবর মাঠ পর্যবেক্ষকদের অবহিত করুন।",
    ne: "ढलान संतृप्ति टेलिमेट्री निगरानी गर्नुहोस् र महत्वपूर्ण पारवहन धमनीहरूमा क्षेत्रीय स्पटर्सलाई सूचित गर्नुहोस्।"
  }
};

/**
 * Normalizes a message string for lookup by trimming and condensing whitespace.
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Translates an alert object into the requested language.
 *
 * @param {Object} alert - The raw alert object from API / state
 * @param {string} langCode - The target ISO / language code (e.g. 'en', 'hi', 'as', 'bn', 'ne')
 * @returns {{ message: string, protocol: string, isFallback: boolean }}
 */
export function getTranslatedAlert(alert, langCode = 'en') {
  if (!alert) {
    return {
      message: '',
      protocol: '',
      isFallback: false
    };
  }

  const rawMessage = typeof alert.message === 'string'
    ? alert.message
    : (alert.message?.en || '');

  const normalized = normalizeText(rawMessage);

  // Check if alert itself has embedded multilingual message object: { message: { en: "...", hi: "..." } }
  if (typeof alert.message === 'object' && alert.message !== null) {
    if (alert.message[langCode]) {
      return {
        message: alert.message[langCode],
        protocol: getTranslatedProtocol(alert.risk_level, langCode),
        isFallback: false
      };
    }
    if (alert.message.en) {
      return {
        message: alert.message.en,
        protocol: getTranslatedProtocol(alert.risk_level, 'en'),
        isFallback: langCode !== 'en'
      };
    }
  }

  // Check centralized verified translation dictionary
  const entry = ALERT_MESSAGE_TRANSLATIONS[normalized];
  if (entry && entry[langCode]) {
    return {
      message: entry[langCode],
      protocol: getTranslatedProtocol(alert.risk_level, langCode),
      isFallback: false
    };
  }

  // Fallback to English canonical message
  const fallbackMessage = entry?.en || rawMessage || 'Alert active.';
  return {
    message: fallbackMessage,
    protocol: getTranslatedProtocol(alert.risk_level, 'en'),
    isFallback: langCode !== 'en'
  };
}

/**
 * Translates protocol recommendation according to severity level.
 */
export function getTranslatedProtocol(riskLevel, langCode = 'en') {
  const isCritical = (riskLevel || '').toUpperCase() === 'CRITICAL';
  const group = isCritical ? PROTOCOL_TRANSLATIONS.critical : PROTOCOL_TRANSLATIONS.standard;
  return group[langCode] || group.en;
}
