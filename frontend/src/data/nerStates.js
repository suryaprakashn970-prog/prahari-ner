// North Eastern Region (NER) of India - Core Geographic Constants & Metadata

export const NER_STATES = [
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim"
];

// Centralized State -> Language dataset with English and Native/Local scripts
export const NER_STATE_LANGUAGES = [
  {
    state: "Arunachal Pradesh",
    languages: [
      { englishName: "English", nativeName: "English" },
      { englishName: "Hindi", nativeName: "हिन्दी" },
      { englishName: "Many tribal languages", nativeName: "Multiple indigenous languages" }
    ]
  },
  {
    state: "Assam",
    languages: [
      { englishName: "Assamese", nativeName: "অসমীয়া" },
      { englishName: "Bengali", nativeName: "বাংলা" },
      { englishName: "Bodo", nativeName: "बड़ो" }
    ]
  },
  {
    state: "Manipur",
    languages: [
      { englishName: "Meitei (Manipuri)", nativeName: "ꯃꯤꯇꯩ ꯂꯣꯟ" }
    ]
  },
  {
    state: "Meghalaya",
    languages: [
      { englishName: "English", nativeName: "English" },
      { englishName: "Khasi", nativeName: "খাসি" },
      { englishName: "Garo", nativeName: "Garo" }
    ]
  },
  {
    state: "Mizoram",
    languages: [
      { englishName: "English", nativeName: "English" },
      { englishName: "Mizo", nativeName: "Mizo" }
    ]
  },
  {
    state: "Nagaland",
    languages: [
      { englishName: "English", nativeName: "English" },
      { englishName: "Nagamese", nativeName: "Nagamese" }
    ]
  },
  {
    state: "Tripura",
    languages: [
      { englishName: "Bengali", nativeName: "বাংলা" },
      { englishName: "Kokborok", nativeName: "Kokborok" }
    ]
  },
  {
    state: "Sikkim",
    languages: [
      { englishName: "Nepali", nativeName: "नेपाली" },
      { englishName: "Sikkimese (Bhutia)", nativeName: "འབྲས་ལྗོངས་སྐད་" },
      { englishName: "Lepcha", nativeName: "ᰛᰩᰵᰶᰣ" },
      { englishName: "Limbu", nativeName: "ᤕᤠᤰᤌᤠᤧ" }
    ]
  }
];

// Map lookup: State Name -> array of { englishName, nativeName }
export const NER_LANGUAGES_MAP = Object.fromEntries(
  NER_STATE_LANGUAGES.map((item) => [item.state, item.languages])
);

// Backward-compatible string-array mapping: State Name -> array of English names
export const NER_LANGUAGES = Object.fromEntries(
  NER_STATE_LANGUAGES.map((item) => [
    item.state,
    item.languages.map((l) => l.englishName)
  ])
);

// Initial view bounds covering the entire 8 NER states
// South-West [21.5, 88.0], North-East [29.5, 97.5]
export const NER_BOUNDS = [
  [21.5, 88.0],
  [29.5, 97.5]
];

// Max navigational bounds - prevents panning across the rest of the Indian subcontinent
export const NER_MAX_BOUNDS = [
  [20.5, 87.0],
  [30.5, 98.5]
];

// State-level bounding boxes and regional centers
export const STATE_METADATA = {
  "Arunachal Pradesh": {
    center: [28.21, 94.72],
    bounds: [[26.5, 91.5], [29.5, 97.4]],
    capital: "Itanagar"
  },
  "Assam": {
    center: [26.20, 92.93],
    bounds: [[24.1, 89.7], [28.0, 96.0]],
    capital: "Dispur"
  },
  "Manipur": {
    center: [24.81, 93.93],
    bounds: [[23.8, 93.0], [25.7, 94.8]],
    capital: "Imphal"
  },
  "Meghalaya": {
    center: [25.57, 91.89],
    bounds: [[25.0, 89.8], [26.1, 92.8]],
    capital: "Shillong"
  },
  "Mizoram": {
    center: [23.16, 92.93],
    bounds: [[21.9, 92.2], [24.5, 93.4]],
    capital: "Aizawl"
  },
  "Nagaland": {
    center: [26.15, 94.56],
    bounds: [[25.2, 93.3], [27.0, 95.3]],
    capital: "Kohima"
  },
  "Tripura": {
    center: [23.84, 91.28],
    bounds: [[23.0, 91.1], [24.5, 92.3]],
    capital: "Agartala"
  },
  "Sikkim": {
    center: [27.53, 88.51],
    bounds: [[27.0, 88.0], [28.1, 88.9]],
    capital: "Gangtok"
  }
};

export function isNerState(stateName) {
  if (!stateName) return false;
  const clean = stateName.trim().toLowerCase();
  return NER_STATES.some(s => s.toLowerCase() === clean);
}

export function isValidNerCoordinate(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= 21.0 && lat <= 30.0 && lng >= 87.5 && lng <= 98.0;
}