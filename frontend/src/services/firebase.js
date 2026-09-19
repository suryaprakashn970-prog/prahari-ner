import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase Web SDK only if configuration is provided
let app = null;
let auth = null;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  console.warn("Firebase config is missing. Authentication features are disabled until configured.");
}

export { auth, firebaseConfig };
