/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Sparkles, 
  Sprout, 
  Bell, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  AlertTriangle,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

export const FarmerDashboard = ({ userProfile, setTab }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      // Fetch Notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const data = await notifRes.json();
        setNotifications(data.slice(0, 3));
        setNotifCount(data.filter((n) => !n.read).length);
      }

      // Fetch Transactions
      const txRes = await fetch(`/api/transactions/${userProfile?.uid}`);
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
    } catch (err) {
      console.warn('Error querying real-time updates:', err);
    }
  };

  useEffect(() => {
    if (userProfile?.uid) {
      fetchDashboardData();
    }
  }, [userProfile]);

  const handleMarkRead = async (notifId) => {
    try {
      const res = await fetch(`/api/notifications/${notifId}/read`, { method: 'POST' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTxStatus = async (txId, status) => {
    setLoadingTx(true);
    try {
      const res = await fetch(`/api/transactions/${txId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTx(false);
    }
  };

  const crop = userProfile?.cropDetails || {
    cropName: 'Chili',
    variety: 'Teja 334',
    plantationDate: '2026-05-15',
    expectedHarvestDate: '2026-08-15',
    estimatedQuantity: 1200
  };

  // Days left to harvest
  const daysLeft = Math.max(0, Math.ceil((new Date(crop.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="space-y-6 text-left">
      
      {/* Real-time System Status Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 text-white rounded-2xl p-3.5 px-5 text-xs font-mono font-semibold shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">KYC Profile:</span>
          <span className="text-emerald-400">Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">APMC Feed:</span>
          <span className="text-emerald-400">Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-slate-400">Sourcing Activity:</span>
          <span className="text-blue-400">14 Buyers Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Holding Weather:</span>
          <span className="text-emerald-400">Optimal (11% Rh)</span>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm">
            <Sprout className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {t('welcomeFarmer')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{userProfile?.village}, {userProfile?.district}, {userProfile?.state}</span>
            </p>
          </div>
        </div>

        {/* Action Fast Link */}
        <button
          onClick={() => setTab(2)} // Take to AI advisor tab
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-emerald-500 shadow-sm relative z-10"
        >
          <span>{t('recommendations')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Stat Cards & Crop Status */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Stat 1: Sown Crop */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('activeCrop')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">{crop.cropName}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">{crop.variety}</p>
        </div>

        {/* Stat 2: Est Quantity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('cropQuantity')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">{(crop.estimatedQuantity / 1000).toFixed(1)} <span className="text-sm font-semibold text-slate-500">{t('tonnes')}</span></h3>
          <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">{crop.estimatedQuantity.toLocaleString()} kg</p>
        </div>

        {/* Stat 3: Days to harvest */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('harvestIn')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">{daysLeft} <span className="text-sm font-semibold text-slate-500">{t('harvestDays')}</span></h3>
          <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">Target: {crop.expectedHarvestDate}</p>
        </div>

        {/* Stat 4: Land monitored */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('currentLand')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">{userProfile?.totalLand || 5} <span className="text-sm font-semibold text-slate-500">{t('acres')}</span></h3>
          <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">{userProfile?.soilType || 'Black Soil'}</p>
        </div>
      </div>

      {/* Two-Column Area */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: AI Advisor & Trade Offers */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Optimal Strategy Card */}
          <div className="p-5 rounded-3xl border border-emerald-200 bg-emerald-50/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-br-2xl shadow-sm">
              {t('todayRecommendation')}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-4">
              <div>
                <h4 className="text-2xl font-black text-emerald-800 font-display flex items-center gap-1.5 uppercase">
                  <span>HOLD & WAIT</span>
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-semibold">Best selling day: <span className="text-slate-900 font-bold">In 3 Days</span></p>
              </div>

              <div className="flex gap-4">
                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 text-right shadow-sm">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">{t('confidenceScore')}</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">94%</span>
                </div>
                <div className="bg-emerald-600 px-3.5 py-1.5 rounded-xl border border-emerald-500 text-right shadow-sm">
                  <span className="text-[9px] text-emerald-100 font-bold block uppercase">Est Extra Profit</span>
                  <span className="text-sm font-bold text-white font-mono">+₹14,400</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm mb-4">
              "Market arrivals for Chili in Guntur yard are down 18% due to localized rains. Your crop diagnostics log records high quality grade. Severe weather storm risk is zero. Hold your stock for 3 days to bypass broker congestion and capture high margins."
            </p>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-200 pt-3">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> Updated 10m ago</span>
              <button onClick={() => setTab(2)} className="hover:underline flex items-center gap-1 cursor-pointer text-emerald-700 font-bold bg-transparent border-none">
                Run Advanced Custom Analysis <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Active Sourcing / Trade Offers from Mediators */}
          <div className="bg-white rounded-3xl p-6 text-left border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Mediator Contract Offers ({transactions.filter(t => t.status === 'Pending').length})</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Secure Sourcing</span>
            </div>

            {transactions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No contract offers received from licensing mediators yet. Offers will appear here once mediators draft a sourcing order.
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display">{tx.mediatorName}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Broker Agency Code: LIC-{tx.id.split('-')[1]?.toUpperCase() || 'TX'}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : tx.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'}`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200/60 mb-3 text-xs font-semibold text-slate-700">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">CROP</span>
                        <span className="font-bold text-slate-900">{tx.cropName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">OFFER PRICE</span>
                        <span className="font-bold text-slate-900">₹{tx.price}/kg</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">TOTAL VOLUME</span>
                        <span className="font-bold text-slate-900">{tx.quantity} kg</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-xs font-semibold text-slate-500">Total Contract Value: <span className="font-bold text-slate-900">₹{tx.totalAmount.toLocaleString()}</span></span>
                      
                      {tx.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            disabled={loadingTx}
                            onClick={() => handleUpdateTxStatus(tx.id, 'Cancelled')}
                            className="p-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer flex items-center justify-center"
                            title="Decline Contract"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            disabled={loadingTx}
                            onClick={() => handleUpdateTxStatus(tx.id, 'Completed')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1 border border-emerald-500 cursor-pointer shadow-sm"
                            title="Accept Contract"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Alerts & Bulletins */}
        <div className="md:col-span-4 space-y-6 text-left">
          
          {/* Notifications Panel */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col h-full justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-md font-bold text-slate-900 font-display flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                  <span>{t('recentNotifications')}</span>
                </h3>
                {notifCount > 0 && (
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                    {notifCount} New
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-3.5 rounded-xl border transition flex items-start gap-3 relative ${notif.read ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-emerald-50/40 border-emerald-100 shadow-sm'}`}>
                    
                    {notif.category === 'weather' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    ) : notif.category === 'price' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Bell className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    )}

                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-900 font-display mb-0.5">{notif.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-1.5">{notif.message}</p>
                      
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="text-[10px] font-mono text-emerald-600 hover:text-emerald-700 underline cursor-pointer bg-transparent border-none font-bold"
                        >
                          Dismiss Alert
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <button onClick={() => setTab(4)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 justify-center w-full bg-transparent border-none cursor-pointer">
                <span>Browse Government Schemes Panel</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
