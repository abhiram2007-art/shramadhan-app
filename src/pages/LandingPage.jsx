/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  BrainCircuit, 
  Truck, 
  Sprout, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  Languages
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <BrainCircuit className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 id="brand-logo" className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              {t('brand')}
            </h1>
            <p className="text-[10px] text-emerald-600 font-mono tracking-widest uppercase font-bold">
              Explainable AI Platform
            </p>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Languages className="w-4 h-4 text-emerald-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none border-none pr-2 cursor-pointer"
            >
              <option value="en" className="bg-white text-slate-800">English</option>
              <option value="hi" className="bg-white text-slate-800">हिन्दी</option>
              <option value="te" className="bg-white text-slate-800">తెలుగు</option>
            </select>
          </div>

          <button
            id="nav-sign-in"
            onClick={() => navigate('/auth')}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm border border-emerald-500 cursor-pointer"
          >
            {t('login')}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 z-10 w-full">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div 
            className="md:col-span-7 flex flex-col items-start text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>National Hackathon Showcase</span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.14] mb-6"
            >
              {t('heroTitle')}
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-600 mb-8 max-w-xl font-medium leading-relaxed"
            >
              {t('heroSub')}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <button
                id="hero-get-started"
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-md transition duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-base cursor-pointer border border-emerald-500"
              >
                <span>{t('getStarted')}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Government & KYC Verified Sandbox</span>
              </div>
            </motion.div>

            {/* Tagline Footer Banner */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <p className="text-sm italic text-slate-700 font-medium border-l-4 border-l-emerald-600 pl-4 leading-relaxed">
                "{t('tagline')}"
              </p>
            </motion.div>
          </motion.div>

          {/* Right Bento visual box */}
          <motion.div 
            className="md:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Forecast Simulator</span>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Graphic Simulator */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-bold">Today APMC Base</span>
                  <span className="text-base font-bold text-slate-900 font-mono">₹185.00 <span className="text-xs text-slate-500 font-light">/kg</span></span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Expected In 3 Days
                  </span>
                  <span className="text-base font-bold text-emerald-700 font-mono">₹224.00 <span className="text-xs font-light">/kg</span></span>
                </div>
              </div>

              {/* Decision Box */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 mb-2 text-left">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Explainable Decision Recommendation</h4>
                <div className="text-lg font-bold text-slate-900 font-display mb-1.5 flex items-center gap-1.5">
                  <span>HOLD & WAIT</span>
                  <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">94% Confidence</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  "Weather sensors report dry regional air (moisture 11%). Chili storage is highly stable. Delay sales for 3 days to bypass the current mediator supply congestion and gain 21% profit increase."
                </p>
              </div>
            </div>
          </motion.div>

         </div>
      </main>

      {/* Feature Section */}
      <section className="w-full bg-white border-t border-slate-200 py-16 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-950 font-display">
              {t('featuresTitle')}
            </h3>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              {t('featuresSub')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display mb-2">{t('feature1Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('feature1Desc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 mb-4">
                <BrainCircuit className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display mb-2">{t('feature2Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('feature2Desc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 mb-4">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display mb-2">{t('feature3Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('feature3Desc')}</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 mb-4">
                <Sprout className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display mb-2">{t('feature4Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{t('feature4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Panel */}
      <section className="w-full py-16 bg-slate-50 z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-950 font-display">
              {t('testimonialsTitle')}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 text-left border border-slate-200 flex flex-col justify-between shadow-sm">
              <p className="text-sm italic text-slate-700 leading-relaxed font-medium">
                "Before using Shramadhan, I sold my Chili crop at ₹175/kg right after harvest because I feared spoilage. The Shramadhan decision suite assured me that regional humidity permitted 10 days of holding, and suggested a shared truck with my neighbor Prasad. I eventually sold at ₹218/kg, saving ₹32,000 on transport!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 text-sm font-bold text-emerald-600 shadow-sm">
                  VK
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Venkata Koteswara Rao</h5>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans">Farmer, Bapatla District, AP</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-left border border-slate-200 flex flex-col justify-between shadow-sm">
              <p className="text-sm italic text-slate-700 leading-relaxed font-medium">
                "The Crop Diagnostics tool is magical. My tomato crop showed leaf spots, and I was going to purchase expensive chemical pesticide. I uploaded a photo, and the AI correctly identified early leaf spot due to micro-irrigation pooling, recommending simple organic pruning. Saved my crop and my money."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 text-sm font-bold text-emerald-600 shadow-sm">
                  SK
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Siva Kumar Reddy</h5>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans">Farmer, Guntur District, AP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Team contact */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>24/7 Toll-Free Agronomist Support: 1800-AGRI-WISE</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Shramadhan. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
