/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  DollarSign, 
  Fuel, 
  Leaf,
  Users
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

export const SharedLogisticsPage = ({ userProfile }) => {
  const { t } = useLanguage();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        const res = await fetch(`/api/logistics/${userProfile?.district || 'Guntur'}`);
        if (res.ok) {
          const data = await res.json();
          setPools(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogistics();
  }, [userProfile]);

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('logisticsTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t('logisticsSub')}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Col: Active Pool Matches (Span 7) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 font-display border-b border-slate-100 pb-3 flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>{t('nearbyPools')}</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Active Matches</span>
            </h3>

            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-500">Loading pooled routes...</p>
              </div>
            ) : pools.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No active logistics pools in Guntur district right now. Create a new pool match to share trucking.
              </div>
            ) : (
              <div className="space-y-4">
                {pools.map((pool) => (
                  <div key={pool.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition duration-200 space-y-4 text-left shadow-sm">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          <span>Pooled Route {pool.id.toUpperCase()}</span>
                        </h4>
                        <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1 inline-block">Route: {pool.route.join(' ➔ ')}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        Shared Truck Ready
                      </span>
                    </div>

                    {/* Farmers list */}
                    <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">PARTICIPATING FARMERS</span>
                      {pool.farmers.map((farmer, fIdx) => (
                        <div key={fIdx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0 font-medium">
                          <span className="text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{farmer.name} ({farmer.village})</span>
                          </span>
                          <span className="text-emerald-700 font-semibold font-mono">
                            {farmer.cropName} • {farmer.quantity} kg
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Statistics calculator block */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold">
                        <span className="text-[8px] text-slate-400 block font-bold uppercase">COMBINED QTY</span>
                        <strong className="text-slate-800 font-mono">{pool.totalQuantity} kg</strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold">
                        <span className="text-[8px] text-slate-400 block font-bold uppercase">DIESEL SAVED</span>
                        <strong className="text-emerald-700 font-mono flex items-center justify-center gap-0.5">
                          <Fuel className="w-3 h-3" />
                          <span>{pool.fuelSaved} L</span>
                        </strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold">
                        <span className="text-[8px] text-slate-400 block font-bold uppercase">FREIGHT SAVED</span>
                        <strong className="text-slate-800 font-mono">₹{pool.costSaved}</strong>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold">
                        <span className="text-[8px] text-slate-400 block font-bold uppercase">NET MARGINS</span>
                        <strong className="text-emerald-700 font-mono">+₹{pool.profitIncrease}</strong>
                      </div>
                    </div>

                    {/* Join button */}
                    <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition border border-emerald-500 flex items-center justify-center gap-1 cursor-pointer shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Join Sourcing Truck Pool Match</span>
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Route Map simulation (Span 5) */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-grow flex flex-col justify-between text-left">
            <div>
              <h3 className="text-md font-bold text-slate-900 font-display border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Pooled Dispatch Route Map</span>
              </h3>

              {/* Beautiful interactive SVG map of Guntur Sourcing Route */}
              <div className="w-full h-[220px] bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex items-center justify-center shadow-inner">
                
                {/* SVG Vector Drawing */}
                <svg viewBox="0 0 400 240" className="w-full h-full p-4 relative z-10">
                  {/* Grid lines for coordinate simulation */}
                  <line x1="50" y1="0" x2="50" y2="240" stroke="rgba(0,0,0,0.02)" />
                  <line x1="150" y1="0" x2="150" y2="240" stroke="rgba(0,0,0,0.02)" />
                  <line x1="250" y1="0" x2="250" y2="240" stroke="rgba(0,0,0,0.02)" />
                  <line x1="350" y1="0" x2="350" y2="240" stroke="rgba(0,0,0,0.02)" />
                  
                  {/* Sourcing trace line */}
                  <motion.path 
                    d="M 60,180 Q 150,110 240,140 T 340,70" 
                    fill="none" 
                    stroke="rgba(5, 150, 105, 0.15)" 
                    strokeWidth="3" 
                    strokeDasharray="6 4"
                  />
                  <motion.path 
                    d="M 60,180 Q 150,110 240,140 T 340,70" 
                    fill="none" 
                    stroke="#059669" 
                    strokeWidth="3" 
                    strokeDasharray="1000"
                    initial={{ strokeDashoffset: 1000 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Stop 1: Bapatla */}
                  <g>
                    <circle cx="60" cy="180" r="6" fill="#059669" className="animate-pulse" />
                    <circle cx="60" cy="180" r="12" stroke="#059669" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '3s' }} />
                    <text x="60" y="200" fill="#1e293b" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">Bapatla (Start)</text>
                  </g>

                  {/* Stop 2: Eluru */}
                  <g>
                    <circle cx="240" cy="140" r="6" fill="#059669" />
                    <circle cx="240" cy="140" r="10" stroke="#059669" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '4s' }} />
                    <text x="240" y="125" fill="#1e293b" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700" textAnchor="middle">Eluru (Pickup)</text>
                  </g>

                  {/* Stop 3: Guntur APMC Gunj */}
                  <g>
                    <circle cx="340" cy="70" r="7" fill="#1565c0" />
                    <rect x="334" y="64" width="12" height="12" fill="none" stroke="#1565c0" strokeWidth="1.5" />
                    <text x="340" y="52" fill="#1e293b" fontSize="10" fontFamily="var(--font-sans)" fontWeight="800" textAnchor="middle">Guntur APMC</text>
                  </g>
                </svg>

                {/* Floating active legend */}
                <div className="absolute bottom-3 left-3 bg-slate-900/95 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-emerald-400 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-white font-bold">GPS Tracking: Transit Active</span>
                </div>
              </div>
            </div>

            {/* Environmental carbon savings bento box */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 mt-4 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 border border-emerald-200">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-display">Logistics Carbon Footprint Savings</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Calculated carbon emission prevention metrics.</p>
                </div>
              </div>
              <div className="text-right font-semibold text-xs shrink-0">
                <span className="block text-[8px] text-slate-400 font-bold uppercase">CO2 REDUCTION</span>
                <strong className="text-emerald-700 font-black">-110 kg CO2</strong>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
