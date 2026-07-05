/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  BrainCircuit, 
  Truck, 
  Store, 
  Building, 
  MapPin, 
  Scale, 
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

export const AIRecommendationsPage = ({ userProfile }) => {
  const { t } = useLanguage();

  // Inputs
  const [currentPrice, setCurrentPrice] = useState('185');
  const [expectedFuturePrice, setExpectedFuturePrice] = useState('224');
  const [storageCapacity, setStorageCapacity] = useState('15');
  const [transitDistance, setTransitDistance] = useState('25');
  const [fuelCost, setFuelCost] = useState('98');
  const [spoilageRisk, setSpoilageRisk] = useState('10');
  const [weatherAlerts, setWeatherAlerts] = useState('5');
  const [paymentDelay, setPaymentDelay] = useState('1');
  const [trustScore, setTrustScore] = useState('85');

  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState(null);

  const runDecisionAnalysis = async () => {
    setLoading(true);
    setDecision(null);
    try {
      const res = await fetch('/api/decision-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPrice: Number(currentPrice),
          expectedFuturePrice: Number(expectedFuturePrice),
          storageCapacity: Number(storageCapacity),
          distance: Number(transitDistance),
          fuelCost: Number(fuelCost),
          transportCost: Number(transitDistance) * 15, // Calculated total freight
          spoilageRisk: Number(spoilageRisk),
          demand: 'Medium-High',
          weather: Number(weatherAlerts),
          paymentDelay: Number(paymentDelay),
          trustScore: Number(trustScore)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDecision(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Channel Sourcing mock array based on formulas
  const calculateChannels = () => {
    const curP = Number(currentPrice);
    const dist = Number(transitDistance);
    const weight = userProfile?.cropDetails?.estimatedQuantity || 1200;

    return [
      {
        type: 'Local Mediator',
        name: 'Broker Agency (Village Gate)',
        sellingPrice: curP * 0.95,
        transportCost: 0,
        storageCost: 0,
        spoilageCost: 0,
        netProfit: (curP * 0.95) * weight,
        risk: 'Medium',
        score: 82,
        reason: 'Zero transit overheads and instant cash settlement, but buying price sits below the APMC index.'
      },
      {
        type: 'Wholesale Market',
        name: 'Regional Wholesale Gunj',
        sellingPrice: curP * 1.02,
        transportCost: dist * 8,
        storageCost: 0,
        spoilageCost: weight * (Number(spoilageRisk) / 200),
        netProfit: (curP * 1.02) * weight - (dist * 8) - (weight * (Number(spoilageRisk) / 200)),
        risk: 'Medium',
        score: 78,
        reason: 'Decent selling price index, but demands immediate shipping fees and exposure to long mandi queues.'
      },
      {
        type: 'APMC Market',
        name: 'Government APMC Yard',
        sellingPrice: curP * 1.05,
        transportCost: dist * 10,
        storageCost: weight * 0.1,
        spoilageCost: weight * (Number(spoilageRisk) / 100),
        netProfit: (curP * 1.05) * weight - (dist * 10) - (weight * 0.1) - (weight * (Number(spoilageRisk) / 100)),
        risk: 'Low',
        score: 86,
        reason: 'Officially certified floor pricing with transparent weighing audits. Sizable queuing wait times.'
      },
      {
        type: 'Online Buyer',
        name: 'Shramadhan Direct Buyer Pool',
        sellingPrice: curP * 1.12,
        transportCost: dist * 4, // Shared trucking
        storageCost: 0,
        spoilageCost: 0,
        netProfit: (curP * 1.12) * weight - (dist * 4),
        risk: 'Low',
        score: 95,
        reason: 'Top premium buying index enabled by online contract grading, with freight logistics shared with nearby fields.'
      }
    ];
  };

  const channels = calculateChannels().sort((a,b) => b.score - a.score);

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('decisionEngineTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t('decisionEngineSub')}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Col: Decision form (Span 7) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-md font-bold text-slate-900 font-display border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-600" />
            <span>Customize AI Decision Variables</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Today APMC (₹/kg)</label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target In 3 Days</label>
              <input
                type="number"
                value={expectedFuturePrice}
                onChange={(e) => setExpectedFuturePrice(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dry Storage Limit (Days)</label>
              <input
                type="number"
                value={storageCapacity}
                onChange={(e) => setStorageCapacity(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('transitDistance')} (km)</label>
              <input
                type="number"
                value={transitDistance}
                onChange={(e) => setTransitDistance(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Diesel Cost (₹/L)</label>
              <input
                type="number"
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t('spoilageRiskLabel')} (%)</label>
              <input
                type="number"
                value={spoilageRisk}
                onChange={(e) => setSpoilageRisk(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Storm/Rain Risk (%)</label>
              <input
                type="number"
                value={weatherAlerts}
                onChange={(e) => setWeatherAlerts(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Delay (Days)</label>
              <input
                type="number"
                value={paymentDelay}
                onChange={(e) => setPaymentDelay(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Broker Trust Rating</label>
              <input
                type="number"
                value={trustScore}
                onChange={(e) => setTrustScore(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl p-2.5 text-xs text-slate-900 font-semibold"
              />
            </div>
          </div>

          <button
            onClick={runDecisionAnalysis}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-500 shadow-sm disabled:opacity-55"
          >
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
            <span>{loading ? "Analyzing Field Parameters..." : "Synthesize AI Decision Report"}</span>
          </button>
        </div>

        {/* Right Col: Decision analysis result (Span 5) */}
        <div className="md:col-span-5 flex flex-col justify-between">
          {!decision ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-grow flex flex-col items-center justify-center text-center py-12">
              <BrainCircuit className="w-12 h-12 text-slate-300 mb-4" />
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Awaiting Field Customization</h4>
              <p className="text-xs text-slate-500 max-w-[240px] font-medium leading-relaxed">
                Click the analysis button to process storage stability, transit fuel variables, and weather risk ratios.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/40 flex-grow flex flex-col justify-between text-left relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4 border-b border-emerald-200/60 pb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('decisionLabel')}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Confidence: {decision.confidence}%
                  </span>
                </div>

                <div className="text-3xl font-black text-emerald-800 font-display mb-2 uppercase flex items-center gap-1.5">
                  <span>{decision.decision}</span>
                  <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-emerald-100 shadow-sm mb-4">
                  "{decision.reason}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white border border-slate-200 p-3 rounded-2xl font-semibold text-xs shadow-sm">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">OPTIMAL SALE DAY</span>
                  <strong className="text-slate-900 text-sm">{decision.best_day}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">ADDITIONAL INCOME</span>
                  <strong className="text-emerald-700 text-sm">+₹{decision.expected_profit.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Selling Channels Comparison List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>{t('sellingChannels')}</span>
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Yield Payload: {userProfile?.cropDetails?.estimatedQuantity || 1200} kg</span>
        </div>

        <div className="space-y-4">
          {channels.map((chan, idx) => (
            <div key={chan.type} className={`p-4 rounded-2xl border transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative ${idx === 0 ? 'bg-emerald-50 border-emerald-300 shadow-sm' : 'bg-slate-50/50 border-slate-200'}`}>
              
              {/* Channel metadata */}
              <div className="text-left md:max-w-md">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 font-display">{chan.type}</h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{chan.name}</span>
                  {idx === 0 && (
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                      <Award className="w-3 h-3 fill-emerald-600 text-emerald-600" /> Best Channel
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">"{chan.reason}"</p>
              </div>

              {/* Channel finances */}
              <div className="flex flex-wrap gap-4 md:gap-6 text-xs font-semibold text-slate-700">
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">SELLING RATE</span>
                  <span className="font-bold text-slate-900">₹{chan.sellingPrice.toFixed(0)} /kg</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">TRANSIT COST</span>
                  <span className="font-bold text-slate-900">₹{chan.transportCost.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">{t('netProfit')}</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{chan.netProfit.toLocaleString()}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center min-w-[50px] shadow-sm">
                  <span className="text-[8px] text-slate-400 block uppercase font-bold">Index</span>
                  <strong className="text-slate-800 font-black">{chan.score}%</strong>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
