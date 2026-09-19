import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, PhoneCall } from 'lucide-react';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
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

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Google Sign-In is not configured yet. Add the Firebase configuration to frontend/.env.');
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
        setError('Sign-in cancelled. Popup was closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-In in Firebase Console (Authentication > Settings > Authorized domains).');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error during authentication. Please check your internet connection.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in Firebase Console.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError('Phone authentication is not configured yet. Add the Firebase configuration to frontend/.env.');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }

      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setStep(2);
    } catch (err) {
      console.error('Phone Sign-In error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded for today. Please use Google Sign-In.');
      } else {
        setError(err.message || 'Failed to send SMS OTP.');
      }
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!window.confirmationResult) {
      setError('Verification session expired. Please request a new OTP.');
      setStep(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await window.confirmationResult.confirm(otp);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('OTP confirmation error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP code. Please check and enter the 6-digit code again.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP code has expired. Please request a new code.');
      } else {
        setError(err.message || 'OTP verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Shield className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          PRAHARI-NER
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          AI-Based Landslide Early Warning & Risk Monitoring
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded text-sm flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!auth && (
            <div className="mb-6 text-sm text-center text-amber-900 bg-amber-50 border border-amber-300 p-4 rounded-md">
              <p className="font-semibold mb-1">Google Sign-In is not configured yet.</p>
              <p className="text-xs text-amber-800">
                Add the Firebase configuration to frontend/.env or Render environment variables to activate real authentication.
              </p>
            </div>
          )}

          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!auth || loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 mb-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">OR PHONE OTP</span>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={!auth || loading}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div id="recaptcha-container"></div>

                <button
                  type="submit"
                  disabled={!auth || phone.length < 10 || loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending OTP...' : 'Send SMS OTP'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center mb-2">
                  Verify Phone Number
                </label>
                <p className="text-sm text-gray-500 text-center mb-4">
                  Enter 6-digit OTP sent to +91 {phone}
                </p>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="block w-full text-center tracking-[0.6em] text-2xl font-mono px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <div className="flex justify-between text-sm text-blue-600">
                <button type="button" onClick={handleSendOtp} disabled={loading} className="hover:underline">
                  Resend OTP
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="hover:underline">
                  Change Number
                </button>
              </div>
            </form>
          )}

          {/* Emergency Calling Section - Always accessible without login */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
              Direct Emergency Contacts (No Login Required)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 text-red-700 rounded-md font-bold hover:bg-red-100 border border-red-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 🚨 Emergency 112
              </a>
              <a
                href="tel:108"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 text-emerald-700 rounded-md font-bold hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 🚑 Ambulance 108
              </a>
              <a
                href="tel:101"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 text-amber-700 rounded-md font-bold hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 🚒 Fire 101
              </a>
              <a
                href="tel:100"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 rounded-md font-bold hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 👮 Police 100
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
