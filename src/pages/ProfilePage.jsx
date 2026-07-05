/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  Languages, 
  LogOut, 
  Sparkles,
  CheckCircle,
  Building
} from 'lucide-react';
import { auth } from '../lib/firebase.js';
import { useLanguage } from '../lib/LanguageContext.jsx';

export const ProfilePage = ({ userProfile, setProfile }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [success, setSuccess] = useState(null);

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    setSuccess("Language preferences updated successfully.");
    setTimeout(() => setSuccess(null), 3000);

    try {
      // Sync preference to server
      if (userProfile?.uid) {
        const res = await fetch(`/api/user/${userProfile.uid}/language`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: newLang })
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      }
    } catch (err) {
      console.warn("Language synchronization failed server-side.", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error(err);
    }
    // Wipe local cache
    localStorage.removeItem('agriwise_uid');
    localStorage.removeItem('agriwise_role');
    localStorage.removeItem('agriwise_demo_profile');
    navigate('/');
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('profile')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Review digital farming account details and localization configurations.
        </p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Account Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm text-lg">
              {userProfile?.role === 'Farmer' ? '🌾' : '🏢'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">{userProfile?.name || 'G. Venkateswarlu'}</h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 mt-1 inline-block">
                Verified {userProfile?.role || 'Farmer'} Profile
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>

        {/* Profile items */}
        <div className="grid md:grid-cols-2 gap-4 text-xs font-semibold relative z-10">
          
          <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 flex items-center gap-3">
            <User className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">EMAIL ADDRESS</span>
              <span className="text-slate-800 font-medium">{userProfile?.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 flex items-center gap-3">
            <Phone className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">MOBILE NUMBER</span>
              <span className="text-slate-800 font-medium font-mono">{userProfile?.mobile || '9848022338'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 flex items-center gap-3">
            <MapPin className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">PRIMARY REGION</span>
              <span className="text-slate-800 font-medium">{userProfile?.village || 'Kaza'}, {userProfile?.district || 'Guntur'}, {userProfile?.state || 'Andhra Pradesh'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-200 flex items-center gap-3">
            <FileText className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">ACCOUNT IDENTITY</span>
              <span className="text-slate-800 font-mono font-medium">UID: {userProfile?.uid?.substr(0, 10).toUpperCase() || 'DUMMYUID'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Language Switching Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-left">
        <h3 className="text-md font-bold text-slate-900 font-display border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
          <Languages className="w-5 h-5 text-emerald-600" />
          <span>Localization Preferences</span>
        </h3>

        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
          Switch mother-tongue languages instantly to review forecasting indices, diagnostics, and advisor directives in English, Hindi, or Telugu.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`py-3 rounded-2xl border text-xs font-bold transition duration-200 cursor-pointer ${language === 'en' ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'bg-slate-50/50 text-slate-700 border-slate-200 hover:border-slate-300'}`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`py-3 rounded-2xl border text-xs font-bold transition duration-200 cursor-pointer ${language === 'hi' ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'bg-slate-50/50 text-slate-700 border-slate-200 hover:border-slate-300'}`}
          >
            🇮🇳 हिन्दी (Hindi)
          </button>
          <button
            onClick={() => handleLanguageChange('te')}
            className={`py-3 rounded-2xl border text-xs font-bold transition duration-200 cursor-pointer ${language === 'te' ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'bg-slate-50/50 text-slate-700 border-slate-200 hover:border-slate-300'}`}
          >
            🇮🇳 తెలుగు (Telugu)
          </button>
        </div>
      </div>

    </div>
  );
};
