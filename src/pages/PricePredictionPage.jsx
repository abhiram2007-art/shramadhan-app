/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Calendar, 
  Search,
  Scale
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

const DISTRICTS = [
  "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", 
  "Kurnool", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", 
  "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa",
  "Bapatla", "Eluru", "Nandyal"
];

const CROPS = [
  "Chili", "Paddy", "Cotton", "Groundnut", "Tomato", "Maize", "Turmeric", "Onion"
];

export const PricePredictionPage = () => {
  const { t } = useLanguage();

  const [crop, setCrop] = useState('Chili');
  const [district, setDistrict] = useState('Guntur');
  const [season, setSeason] = useState('Kharif');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, district, season })
      });
      if (res.ok) {
        const data = await res.json();
        setForecast(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('pricePredictionTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t('pricePredictionSub')}
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Crop Index</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-900 font-semibold"
            >
              {CROPS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">AP Sourcing District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-900 font-semibold"
            >
              {DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sowing Crop Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-900 font-semibold"
            >
              <option value="Kharif">Kharif Season (Monsoon)</option>
              <option value="Rabi">Rabi Season (Winter)</option>
              <option value="Zaid">Zaid Season (Summer)</option>
            </select>
          </div>

          <button
            onClick={fetchForecast}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition duration-200 border border-emerald-500 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Generate Forecast</span>
          </button>
        </div>
      </div>

      {/* Main forecast layout */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold text-slate-500">Synthesizing satellite trading indices...</p>
        </div>
      ) : forecast && (
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Chart visual card (Span 8) */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>{t('forecastGraph')} ({forecast.cropName})</span>
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Index Volatility: Stable</span>
                </span>
              </div>

              {/* Responsive Container for Recharts */}
              <div className="w-full h-[280px] pr-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={forecast.historicalPrices}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }} 
                    />
                    <YAxis 
                      stroke="#64748b" 
                      style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }} 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e2e8f0', 
                        borderRadius: '12px',
                        color: '#1e293b',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> APMC Base</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" /> Shramadhan Projected Slope</span>
            </div>
          </div>

          {/* Forecast details box (Span 4) */}
          <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
            
            {/* Price Cards Stack */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex justify-between items-center bg-slate-50/50 p-3.5 rounded-2xl border border-slate-200/60 text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">{t('priceToday')}</span>
                <strong className="text-slate-900 text-sm font-mono">₹{forecast.todayPrice}/kg</strong>
              </div>

              <div className="flex justify-between items-center bg-slate-50/50 p-3.5 rounded-2xl border border-slate-200/60 text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">{t('priceTomorrow')}</span>
                <strong className="text-slate-900 text-sm font-mono">₹{forecast.tomorrowPrice}/kg</strong>
              </div>

              <div className="flex justify-between items-center bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs">
                <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px]">{t('price3Days')}</span>
                <strong className="text-emerald-700 text-base font-mono">₹{forecast.threeDayPrice}/kg</strong>
              </div>

              <div className="flex justify-between items-center bg-slate-50/50 p-3.5 rounded-2xl border border-slate-200/60 text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">{t('price7Days')}</span>
                <strong className="text-slate-900 text-sm font-mono">₹{forecast.sevenDayPrice}/kg</strong>
              </div>
            </div>

            {/* Confidence & Recommendation Box */}
            <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/40 relative overflow-hidden text-left shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('todayRecommendation')}</h4>
                <div className="bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-800">
                  {forecast.confidence}% Confidence
                </div>
              </div>

              <div className="text-2xl font-black text-emerald-800 font-display mb-2 flex items-center gap-1">
                <span>{forecast.recommendation === 'HOLD_WAIT' ? "HOLD & WAIT" : forecast.recommendation === 'SELL_TODAY' ? "SELL TODAY" : "NEGOTIATE"}</span>
                <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4">
                "{forecast.reason}"
              </p>

              <div className="text-[11px] font-semibold text-emerald-800 bg-white p-3 rounded-xl border border-emerald-100 inline-block shadow-sm">
                Expected Extra Yield Margin: <strong className="text-emerald-700">+₹{forecast.expectedProfit.toLocaleString()}</strong>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
