/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  MapPin, 
  Sparkles, 
  Calculator, 
  UserPlus, 
  Star, 
  CheckCircle,
  Clock,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

// Sample nearby crop yields registered on Shramadhan
const SAMPLE_FARMS = [
  { id: "f-1", name: "Anil Reddy", village: "Amaravati", district: "Guntur", cropName: "Chili", quantity: 1800, variety: "Teja Chili", plantationDate: "2026-05-10" },
  { id: "f-2", name: "Prasad Rao", village: "Kaza", district: "Guntur", cropName: "Paddy", quantity: 3500, variety: "BPT 5204", plantationDate: "2026-05-12" },
  { id: "f-3", name: "K. Satyanarayana", village: "Pedakurapadu", district: "Guntur", cropName: "Cotton", quantity: 2400, variety: "Bunny Bt", plantationDate: "2026-05-18" },
  { id: "f-4", name: "Y. Koteswara Rao", village: "Eluru", district: "Eluru", cropName: "Chili", quantity: 2000, variety: "Guntur Sannam", plantationDate: "2026-05-14" },
  { id: "f-5", name: "M. Chenchaiah", village: "Bapatla", district: "Bapatla", cropName: "Groundnut", quantity: 1500, variety: "Kadiri 6", plantationDate: "2026-05-20" }
];

export const MediatorDashboard = ({ userProfile }) => {
  const { t } = useLanguage();

  // Active state
  const [nearbyFarms, setNearbyFarms] = useState(SAMPLE_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<any>(SAMPLE_FARMS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Offer fields
  const [buyingPrice, setBuyingPrice] = useState('180');
  const [transportDistance, setTransportDistance] = useState('15');
  const [paymentTime, setPaymentTime] = useState('1'); // instant payment

  // AI Fair Deal Output state
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Sourcing statistics
  const completedTx = userProfile?.completedTransactions || 42;
  const rating = userProfile?.rating || 4.8;
  const trustScore = userProfile?.trustScore || 94;

  const handleRunFairDeal = async () => {
    if (!buyingPrice || !transportDistance) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/fair-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyingPrice: Number(buyingPrice),
          transportDistance: Number(transportDistance),
          paymentTime: Number(paymentTime),
          cropName: selectedFarm.cropName,
          district: selectedFarm.district
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDraftOffer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = {
        farmerId: selectedFarm.id,
        farmerName: selectedFarm.name,
        mediatorId: userProfile?.uid || 'm-dummy',
        mediatorName: userProfile?.name || 'Srinivasa Traders',
        cropName: selectedFarm.cropName,
        quantity: selectedFarm.quantity,
        price: Number(buyingPrice),
        totalAmount: selectedFarm.quantity * Number(buyingPrice),
        status: 'Pending'
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract)
      });

      if (res.ok) {
        setSuccess(`Contract Draft successfully dispatched to ${selectedFarm.name} for review!`);
        // Remove from nearby listings for demo
        setNearbyFarms(prev => {
          const updated = prev.filter(f => f.id !== selectedFarm.id);
          if (updated.length > 0) {
            setSelectedFarm(updated[0]);
          } else {
            setSelectedFarm(null);
          }
          return updated;
        });
      } else {
        setError('Failed to dispatch transaction offer.');
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Real-time Licensed Status Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 text-white rounded-2xl p-3.5 px-5 text-xs font-mono font-semibold shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Agent License:</span>
          <span className="text-emerald-400">LIC-Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">APMC Auditing:</span>
          <span className="text-emerald-400">Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-slate-400">Supply Pool Size:</span>
          <span className="text-blue-400">86 Active Fields</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Fair Deal Advisor:</span>
          <span className="text-emerald-400">Gemini Online</span>
        </div>
      </div>

      {/* Portal welcome */}
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm">
            <Building className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {t('welcomeMediator')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Government Licensed Sourcing Agent Profile</span>
            </p>
          </div>
        </div>

        {/* trust badge */}
        <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 flex items-center gap-3 relative z-10 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('reputationScore')}</span>
            <span className="text-lg font-black text-emerald-700 font-mono">{trustScore}%</span>
          </div>
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-200 text-emerald-600">
            <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Sourcing Statistics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Inspected Lots Sourced</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">{completedTx}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Contracts Dispatched</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Farmer Satisfaction</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">{rating} <span className="text-sm font-semibold text-slate-400">/ 5.0</span></h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">From Verified Reviews</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">On-Time Settlements</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">96%</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Under 24 hour clearance</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fair Pricing Score</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">92%</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Matching APMC Indices</p>
        </div>
      </div>

      {/* Main Grid: Farmer Sourcing Listings vs Contract Draft */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Farmers List */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-4 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>{t('nearbyCrops')}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{nearbyFarms.length} Fields monitored</span>
            </h3>

            {nearbyFarms.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No active farm stocks remaining in your region. All crops have been sourced!
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                {nearbyFarms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => {
                      setSelectedFarm(farm);
                      setAiAnalysis(null);
                      // Default approximate baseline price for Chili vs Paddy vs other
                      setBuyingPrice(farm.cropName === 'Chili' ? '180' : farm.cropName === 'Paddy' ? '22' : '45');
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition duration-200 cursor-pointer block ${selectedFarm?.id === farm.id ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display">{farm.name}</h4>
                        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {farm.village}, {farm.district}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        {farm.cropName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-200/60 mt-2">
                      <span>Harvest Qty: <span className="text-slate-800 font-bold">{farm.quantity} kg</span></span>
                      <span>Sown Variety: <span className="text-slate-800 font-bold">{farm.variety}</span></span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Draft Contract Offer & Fair Deal Analysis */}
        <div className="md:col-span-6 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Draft Procurement Offer</span>
            </h3>

            {success && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold">
                {error}
              </div>
            )}

            {!selectedFarm ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                No farm selected or all nearby lots have been sourced.
              </div>
            ) : (
              <form onSubmit={handleDraftOffer} className="space-y-4">
                {/* Selected Target Farm Info */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-[10px] uppercase block text-emerald-700 mb-1">Target Onboarding Sourcing</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedFarm.name} ({selectedFarm.village})</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                    <span>Crop: <strong className="text-slate-900">{selectedFarm.cropName}</strong></span>
                    <span>Payload: <strong className="text-slate-900">{selectedFarm.quantity} kg</strong></span>
                  </div>
                </div>

                {/* Form Input Variables */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Buying Price (₹/kg)</label>
                    <input
                      type="number"
                      value={buyingPrice}
                      onChange={(e) => setBuyingPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Distance to Farm (km)</label>
                    <input
                      type="number"
                      value={transportDistance}
                      onChange={(e) => setTransportDistance(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Settlement</label>
                    <select
                      value={paymentTime}
                      onChange={(e) => setPaymentTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
                    >
                      <option value="1">Instant (1 Day)</option>
                      <option value="3">3 Days</option>
                      <option value="7">7 Days</option>
                    </select>
                  </div>
                </div>

                {/* AI Analysis trigger */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={handleRunFairDeal}
                    className="flex-1 py-3 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>{analyzing ? "Analyzing Fair Deal..." : "Analyze Price Fairness via AI"}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-emerald-500 disabled:opacity-55 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch Offer</span>
                  </button>
                </div>
              </form>
            )}

            {/* AI Fair Deal Response Panel */}
            {aiAnalysis && (
              <div className="mt-5 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 text-left text-xs text-slate-700">
                <div className="flex items-center justify-between mb-3 border-b border-emerald-200/60 pb-2">
                  <h4 className="text-xs font-bold text-emerald-900 font-display flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>AI Trade Fairness Assessment</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Decision Score: {aiAnalysis.decisionScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 bg-white p-3 rounded-xl border border-emerald-100 font-mono text-[11px] text-slate-800 shadow-sm">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold">FAIR MARKET PRICE</span>
                    <strong className="text-slate-900">₹{aiAnalysis.fairPrice}/kg</strong>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold">RECOMMENDED COUNTER</span>
                    <strong className="text-emerald-700">₹{aiAnalysis.counterOffer}/kg</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium mb-1">
                  "{aiAnalysis.reason}"
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
