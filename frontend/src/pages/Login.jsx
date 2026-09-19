import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, PhoneCall, Globe } from 'lucide-react';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // References to ensure unique RecaptchaVerifier instance and stable lifecycle
  const recaptchaVerifierRef = useRef(null);
  const confirmationResultRef = useRef(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  // Clean up and completely reset the reCAPTCHA DOM container and verifier
  const resetRecaptchaState = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        console.warn('reCAPTCHA clear warning:', e);
      }
      recaptchaVerifierRef.current = null;
    }

    // Recreate fresh DOM node inside wrapper so grecaptcha never sees an already-rendered node
    const wrapper = document.getElementById('recaptcha-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '<div id="recaptcha-container"></div>';
    }
  };

  // Lifecycle cleanup on component unmount
  useEffect(() => {
    return () => {
      resetRecaptchaState();
    };
  }, []);

  // Safe factory for RecaptchaVerifier
  const getOrCreateRecaptchaVerifier = () => {
    if (!auth) return null;

    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    let container = document.getElementById('recaptcha-container');
    if (!container) {
      const wrapper = document.getElementById('recaptcha-wrapper');
      if (wrapper) {
        wrapper.innerHTML = '<div id="recaptcha-container"></div>';
        container = document.getElementById('recaptcha-container');
      }
    }

    if (!container) {
      throw new Error('reCAPTCHA container element not found in DOM.');
    }

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setError(t('login.recaptchaExpired', 'reCAPTCHA challenge expired. Please click Send SMS OTP again.'));
        resetRecaptchaState();
      },
    });

    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  // Google Sign-In with real Firebase provider
  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError(t('login.firebaseNotConfiguredSub', 'Firebase Authentication is not configured yet.'));
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, provider);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError(t('login.googleCancelled', 'Sign-in cancelled. Popup was closed before completing.'));
      } else if (err.code === 'auth/popup-blocked') {
        setError(t('login.googleBlocked', 'Popup was blocked by your browser. Please allow popups for this site.'));
      } else if (err.code === 'auth/network-request-failed') {
        setError(t('login.networkError', 'Network error during authentication. Please check your internet connection.'));
      } else {
        setError(err.message || t('login.authFailed', 'Authentication failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle phone number input with automatic formatting and sanitization
  const handlePhoneChange = (e) => {
    let raw = e.target.value.trim();

    if (raw.startsWith('+91')) {
      raw = raw.slice(3).trim();
    } else if (raw.startsWith('+')) {
      raw = raw.slice(1).trim();
    } else if (raw.startsWith('91') && raw.length > 10) {
      raw = raw.slice(2).trim();
    } else if (raw.startsWith('0') && raw.length > 10) {
      raw = raw.slice(1).trim();
    }

    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (error) setError('');
  };

  // Send SMS OTP via real Firebase Phone Authentication
  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!auth) {
      setError(t('login.firebaseNotConfiguredSub', 'Firebase configuration required.'));
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (!cleanDigits) {
      setError(t('login.enterTenDigits', 'Please enter your 10-digit mobile number.'));
      return;
    }
    if (cleanDigits.length !== 10) {
      setError(t('login.completeTenDigits', 'Please enter a complete 10-digit Indian mobile number (+91XXXXXXXXXX).'));
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
      setError(t('login.validIndianNumber', 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.'));
      return;
    }

    if (sendingOtp || loading) return;

    setSendingOtp(true);
    setLoading(true);
    setError('');

    try {
      const verifier = getOrCreateRecaptchaVerifier();
      const formattedPhone = `+91${cleanDigits}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        verifier
      );

      confirmationResultRef.current = confirmationResult;
      window.confirmationResult = confirmationResult;
      setStep(2);
    } catch (err) {
      console.error('Phone Sign-In error:', err);
      const errMsg = err?.message || '';

      resetRecaptchaState();

      if (errMsg.includes('already been rendered') || err.code === 'auth/captcha-check-failed') {
        setError(t('login.recaptchaResetNotice', 'reCAPTCHA security challenge reset. Please verify your phone number and click Send SMS OTP again.'));
      } else if (err.code === 'auth/invalid-phone-number') {
        setError(t('login.invalidPhoneFormat', 'Invalid phone number format. Please check the 10-digit number and try again.'));
      } else if (err.code === 'auth/too-many-requests') {
        setError(t('login.tooManyAttempts', 'Too many attempts. Please wait a few minutes before trying again.'));
      } else if (err.code === 'auth/quota-exceeded') {
        setError(t('login.smsQuotaExceeded', 'Daily SMS quota exceeded in Firebase project. Please use Google Sign-In.'));
      } else if (err.code === 'auth/network-request-failed') {
        setError(t('login.networkError', 'Network connection failed. Please check your internet connection.'));
      } else {
        setError(err.message || t('login.authFailed', 'Failed to send SMS OTP. Please check the number and try again.'));
      }
    } finally {
      setSendingOtp(false);
      setLoading(false);
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const confirmation = confirmationResultRef.current || window.confirmationResult;
    if (!confirmation) {
      setError(t('login.otpExpired', 'Verification session expired. Please request a new OTP.'));
      setStep(1);
      return;
    }

    if (otp.length !== 6) {
      setError(t('login.invalidOtpCode', 'Please enter the complete 6-digit OTP code.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmation.confirm(otp);
      resetRecaptchaState();
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('OTP confirmation error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError(t('login.invalidOtpCode', 'Invalid OTP code. Please check and enter the 6-digit code again.'));
      } else if (err.code === 'auth/code-expired') {
        setError(t('login.otpExpired', 'OTP code has expired. Please request a new code.'));
      } else {
        setError(err.message || t('login.otpVerificationFailed', 'OTP verification failed.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep(1);
    setOtp('');
    setError('');
    resetRecaptchaState();
  };

  const handleResendOtp = async () => {
    if (sendingOtp || loading) return;
    setError('');
    resetRecaptchaState();
    await handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Quick Language Selector */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 shadow-xs">
        <Globe className="w-4 h-4 text-gray-500 ml-1" />
        <button
          type="button"
          onClick={() => setSelectedLanguage('en')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
            selectedLanguage === 'en'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setSelectedLanguage('hi')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
            selectedLanguage === 'hi'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          हिन्दी
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Shield className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          PRAHARI-NER
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('login.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!auth && (
            <div className="mb-6 text-sm text-center text-amber-900 bg-amber-50 border border-amber-300 p-4 rounded-md">
              <p className="font-semibold mb-1">{t('login.firebaseNotConfigured')}</p>
              <p className="text-xs text-amber-800">
                {t('login.firebaseNotConfiguredSub')}
              </p>
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!auth || loading || sendingOtp}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg shadow-xs bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {loading && !sendingOtp ? t('login.signingIn') : t('login.continueWithGoogle')}
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white text-gray-500 font-bold tracking-wider">
                    {t('login.orPhoneOtp')}
                  </span>
                </div>
              </div>

              {/* Phone OTP Form */}
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="phone-input" className="block text-sm font-semibold text-gray-700">
                      {t('login.mobileNumber')}
                    </label>
                    <span className="text-[11px] text-gray-500 font-mono">
                      +91XXXXXXXXXX
                    </span>
                  </div>

                  <div className="flex rounded-lg shadow-xs border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden bg-white">
                    <span className="inline-flex items-center px-3.5 bg-gray-100 text-gray-700 text-sm font-bold border-r border-gray-300 select-none">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      id="phone-input"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      disabled={loading || sendingOtp}
                      className="flex-1 min-w-0 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder={t('login.phonePlaceholder')}
                    />
                    {phone && !loading && !sendingOtp && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhone('');
                          setError('');
                        }}
                        className="px-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
                        title="Clear number"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    {t('login.phoneHelp')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!auth || phone.length < 10 || loading || sendingOtp}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {sendingOtp ? t('login.sendingSmsOtp') : t('login.sendSmsOtp')}
                </button>
              </form>
            </>
          ) : (
            /* Step 2: OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {t('login.verifyPhoneNumber')}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {t('login.enterOtpCode')}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1 font-mono font-bold text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  +91 {phone}
                </div>
              </div>

              <div>
                <label htmlFor="otp-input" className="sr-only">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  id="otp-input"
                  name="otp"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  disabled={loading}
                  className="block w-full text-center tracking-[0.6em] text-2xl font-mono px-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors cursor-pointer"
              >
                {loading ? t('login.verifyingOtp') : t('login.verifyAndContinue')}
              </button>

              <div className="flex justify-between items-center text-xs text-blue-600 pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || sendingOtp}
                  className="hover:underline font-semibold cursor-pointer disabled:opacity-50"
                >
                  {sendingOtp ? t('login.resendingOtp') : t('login.resendOtp')}
                </button>
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  disabled={loading}
                  className="hover:underline font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  {t('login.editPhoneNumber')}
                </button>
              </div>
            </form>
          )}

          {/* reCAPTCHA wrapper with pristine dynamic container */}
          <div id="recaptcha-wrapper" className="flex justify-center my-2">
            <div id="recaptcha-container"></div>
          </div>

          {/* Direct Emergency Contacts (No login required) */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
              {t('emergency.directHelplinesTitle')}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-700 rounded-md font-bold hover:bg-red-100 border border-red-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 🚨 {t('emergency.primaryBadge')} 112
              </a>
              <a
                href="tel:108"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 text-emerald-700 rounded-md font-bold hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 🚑 {t('emergency.ambulance')} 108
              </a>
              <a
                href="tel:101"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 text-amber-700 rounded-md font-bold hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 🚒 {t('emergency.fire')} 101
              </a>
              <a
                href="tel:100"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 rounded-md font-bold hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 👮 {t('emergency.police')} 100
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}