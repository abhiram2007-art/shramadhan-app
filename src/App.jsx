/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { 
  Sprout, 
  TrendingUp, 
  BrainCircuit, 
  Truck, 
  Building, 
  User, 
  ChevronRight, 
  Menu, 
  X,
  Languages,
  LayoutDashboard,
  Sparkles,
  BarChart,
  LogOut
} from 'lucide-react';
import { auth, onAuthStateChange } from './lib/firebase.js';
import { LanguageProvider, useLanguage } from './lib/LanguageContext.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';

// Import dashboards & modules
import { FarmerDashboard } from './pages/FarmerDashboard.jsx';
import { MediatorDashboard } from './pages/MediatorDashboard.jsx';
import { PricePredictionPage } from './pages/PricePredictionPage.jsx';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage.jsx';
import { SharedLogisticsPage } from './pages/SharedLogisticsPage.jsx';
import { SchemesPage } from './pages/SchemesPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { CropGrowthHub } from './components/CropGrowthHub.jsx';

// Inner App Controller
const AppContent = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab indexing for Farmer workspace (0: Home, 1: Crop Growth Hub, 2: Prediction, 3: AI Advisor, 4: Logistics, 5: Schemes, 6: Analytics, 7: Profile)
  const [activeTab, setActiveTab] = useState(0);

  // Sync session authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Sync with database profile
          const res = await fetch(`/api/user/${firebaseUser.uid}`);
          if (res.ok) {
            const data = await res.json();
            const profileData = data.profile || data;
            setProfile(profileData);
            
            // Auto-restore language preference from user database profile
            if (profileData && profileData.language) {
              setLanguage(profileData.language);
            }
          }
        } catch (err) {
          console.error("Profile sync exception:", err);
        }
      } else {
        const demoProfileStr = localStorage.getItem('agriwise_demo_profile');
        if (demoProfileStr) {
          try {
            const demoProfile = JSON.parse(demoProfileStr);
            setUser({ uid: demoProfile.uid, email: demoProfile.email, isDemo: true });
            setProfile(demoProfile);
            if (demoProfile.language) {
              setLanguage(demoProfile.language);
            }
          } catch (err) {
            console.error("Error reading demo profile", err);
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, setLanguage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-slate-500">Loading digital workspace parameters...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route 
        path="/dashboard" 
        element={
          profile ? (
            profile.role === 'Farmer' ? (
              /* Farmer Dashboard Layout */
              <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
                {/* Side Navigation Panel */}
                <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 shrink-0 flex flex-col justify-between shadow-sm">
                  <div className="space-y-6">
                    {/* Brand header */}
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                        <Sprout className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h1 className="font-bold text-slate-900 text-base font-display leading-none">Shramadhan</h1>
                        <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block mt-1">Sow. Trade. Save</span>
                      </div>
                    </div>

                    {/* Nav tabs list */}
                    <nav className="space-y-1 text-left">
                      <button
                        onClick={() => setActiveTab(0)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 0 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Command Center</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(1)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 1 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <Sprout className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{t('cropHubTitle')}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(2)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 2 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <TrendingUp className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{t('pricePredictionTitle')}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(3)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 3 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <BrainCircuit className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>AI Sourcing Decision</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(4)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 4 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Logistics Pooling</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(5)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 5 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <Building className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Subsidies & Schemes</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(6)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 6 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <BarChart className="w-4 h-4 shrink-0" />
                        <span>Savings Analytics</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(7)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 7 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <User className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{t('profile')}</span>
                      </button>
                    </nav>
                  </div>

                  {/* Profile preview summary */}
                  <div className="hidden md:block border-t border-slate-100 pt-4 text-left">
                    <p className="text-xs font-bold text-slate-800">{profile.name}</p>
                    <p className="text-[10px] font-mono text-emerald-600 mt-0.5">{profile.role}</p>
                  </div>
                </aside>

                {/* Primary Content Scroll Canvas */}
                <main className="flex-1 p-6 md:p-8 max-h-screen overflow-y-auto">
                  {/* Dashboard Header Bar with Unconditional Language Dropdown */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 shrink-0">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        {profile.role} Portal
                      </span>
                    </div>
                    {/* Unconditional Language Selector Dropdown */}
                    <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      <Languages className="w-4 h-4 text-emerald-600" />
                      <select
                        value={language}
                        onChange={async (e) => {
                          const lang = e.target.value;
                          setLanguage(lang);
                          localStorage.setItem('agriwise_lang', lang);
                          // Sync language preference in Firestore immediately
                          try {
                            const updatedProfile = { ...profile, language: lang };
                            await fetch(`/api/user/${profile.uid}/language`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ language: lang })
                            });
                            setProfile(updatedProfile);
                          } catch (err) {
                            console.error('Failed to sync language preference on change:', err);
                          }
                        }}
                        className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none border-none pr-1 cursor-pointer"
                      >
                        <option value="en" className="bg-white text-slate-800">English</option>
                        <option value="hi" className="bg-white text-slate-800">हिन्दी (Hindi)</option>
                        <option value="te" className="bg-white text-slate-800">తెలుగు (Telugu)</option>
                      </select>
                    </div>
                  </div>

                  {activeTab === 0 && <FarmerDashboard userProfile={profile} setTab={setActiveTab} />}
                  {activeTab === 1 && <CropGrowthHub userProfile={profile} />}
                  {activeTab === 2 && <PricePredictionPage />}
                  {activeTab === 3 && <AIRecommendationsPage userProfile={profile} />}
                  {activeTab === 4 && <SharedLogisticsPage userProfile={profile} />}
                  {activeTab === 5 && <SchemesPage />}
                  {activeTab === 6 && <AnalyticsPage userProfile={profile} />}
                  {activeTab === 7 && <ProfilePage userProfile={profile} setProfile={setProfile} />}
                </main>
              </div>
            ) : (
              /* Mediator Dashboard Layout */
              <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
                {/* Side Navigation Panel */}
                <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 shrink-0 flex flex-col justify-between shadow-sm">
                  <div className="space-y-6">
                    {/* Brand header */}
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                        <Building className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h1 className="font-bold text-slate-900 text-base font-display leading-none">Shramadhan Portal</h1>
                        <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block mt-1">Sourcing Agency</span>
                      </div>
                    </div>

                    {/* Nav tabs list */}
                    <nav className="space-y-1 text-left">
                      <button
                        onClick={() => setActiveTab(0)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 0 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Sourcing Dashboard</span>
                      </button>

                      <button
                        onClick={() => setActiveTab(1)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold font-display transition duration-150 cursor-pointer ${activeTab === 1 ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <User className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>Sourcing Profile</span>
                      </button>
                    </nav>
                  </div>

                  {/* Profile preview summary */}
                  <div className="hidden md:block border-t border-slate-100 pt-4 text-left">
                    <p className="text-xs font-bold text-slate-800">{profile.name}</p>
                    <p className="text-[10px] font-mono text-emerald-600 mt-0.5">{profile.role}</p>
                  </div>
                </aside>

                {/* Primary Content Scroll Canvas */}
                <main className="flex-1 p-6 md:p-8 max-h-screen overflow-y-auto">
                  {/* Dashboard Header Bar with Unconditional Language Dropdown */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 shrink-0">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        {profile.role} Portal
                      </span>
                    </div>
                    {/* Unconditional Language Selector Dropdown */}
                    <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      <Languages className="w-4 h-4 text-emerald-600" />
                      <select
                        value={language}
                        onChange={async (e) => {
                          const lang = e.target.value;
                          setLanguage(lang);
                          localStorage.setItem('agriwise_lang', lang);
                          // Sync language preference in Firestore immediately
                          try {
                            const updatedProfile = { ...profile, language: lang };
                            await fetch(`/api/user/${profile.uid}/language`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ language: lang })
                            });
                            setProfile(updatedProfile);
                          } catch (err) {
                            console.error('Failed to sync language preference on change:', err);
                          }
                        }}
                        className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none border-none pr-1 cursor-pointer"
                      >
                        <option value="en" className="bg-white text-slate-800">English</option>
                        <option value="hi" className="bg-white text-slate-800">हिन्दी (Hindi)</option>
                        <option value="te" className="bg-white text-slate-800">తెలుగు (Telugu)</option>
                      </select>
                    </div>
                  </div>

                  {activeTab === 0 && <MediatorDashboard userProfile={profile} />}
                  {activeTab === 1 && <ProfilePage userProfile={profile} setProfile={setProfile} />}
                </main>
              </div>
            )
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}
