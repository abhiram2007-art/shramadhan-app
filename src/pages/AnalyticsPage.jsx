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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  Award, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

const SALES_HISTORY = [
  { month: "Jan", revenue: 45000, profit: 32000, savings: 3200 },
  { month: "Feb", revenue: 58000, profit: 41000, savings: 4800 },
  { month: "Mar", revenue: 62000, profit: 45000, savings: 5500 },
  { month: "Apr", revenue: 78000, profit: 58000, savings: 8200 },
  { month: "May", revenue: 89000, profit: 67000, savings: 9400 },
  { month: "Jun", revenue: 112000, profit: 86000, savings: 14400 }
];

export const AnalyticsPage = ({ userProfile }) => {
  const { t } = useLanguage();

  const totalRev = SALES_HISTORY.reduce((sum, item) => sum + item.revenue, 0);
  const totalProf = SALES_HISTORY.reduce((sum, item) => sum + item.profit, 0);
  const totalSaved = SALES_HISTORY.reduce((sum, item) => sum + item.savings, 0);

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('analyticsTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t('analyticsSub')}
        </p>
      </div>

      {/* Analytics stat cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('totalRevenue')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">₹{totalRev.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Sourcing turnover</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('totalProfitLabel')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">₹{totalProf.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Net of logistics overheads</p>
        </div>

        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200 text-left relative overflow-hidden shadow-sm">
          <div className="absolute top-[-5px] right-[-5px] p-1 bg-emerald-100 border-b border-l border-emerald-200 text-emerald-700">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">{t('savedByAi')}</span>
          <h3 className="text-2xl font-extrabold text-emerald-700 font-display">₹{totalSaved.toLocaleString()}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Transport & wait margins</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('accuracyRate')}</span>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">94.8%</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">APMC prediction alignment</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue vs Profit (Bar) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 font-display mb-4 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
            <span>Monthly Revenue vs Net Yield proceeds</span>
          </h3>

          <div className="w-full h-[240px] pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SALES_HISTORY}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }} 
                />
                <YAxis 
                  stroke="#64748b" 
                  style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }} 
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
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Savings Slope (Area) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 font-display mb-4 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
            <span>Incremental Profit Saved Utilizing Explainable AI</span>
          </h3>

          <div className="w-full h-[240px] pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SALES_HISTORY}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }} 
                />
                <YAxis 
                  stroke="#64748b" 
                  style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }} 
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
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
