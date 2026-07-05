/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  BadgeAlert,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext.jsx';

const INITIAL_SCHEMES = [
  {
    id: "scheme-pmkisan",
    name: "PM-KISAN Samman Nidhi",
    benefits: "Direct income support of ₹6,000 per year in three equal installments of ₹2,000 each directly into bank accounts.",
    eligibility: "All small and marginal landholder farmer families owning agricultural land deeds.",
    deadline: "No closing date (Continuous)",
    documentsRequired: ["Aadhaar Card", "Land Ownership Certificate (Patta)", "Bank Account Passbook"],
    status: "Approved",
    category: "Central Government"
  },
  {
    id: "scheme-pmfby",
    name: "PM Fasal Bima Yojana (Crop Insurance)",
    benefits: "Comprehensive insurance coverage against crop failure due to dry spells, pests, floods, or natural fires.",
    eligibility: "All farmers growing notified crops in notified districts.",
    deadline: "10 August 2026",
    documentsRequired: ["Sowing Certificate from Village Revenue Officer", "Patta Adangal Land copy", "Identity Proof"],
    status: "In Progress",
    category: "Central Government"
  },
  {
    id: "scheme-drip",
    name: "AP Micro-Irrigation Drip Subsidy",
    benefits: "Up to 90% direct subsidy on high-quality drip and sprinkler hardware sets.",
    eligibility: "Small and marginal farmers of Andhra Pradesh with borewell ground water access.",
    deadline: "15 August 2026",
    documentsRequired: ["Patta Adangal copy", "Soil & Water Quality inspection reports", "Aadhaar Registration"],
    status: "Not Applied",
    category: "Andhra Pradesh State Government"
  }
];

export const SchemesPage = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState(INITIAL_SCHEMES);
  const [activeScheme, setActiveScheme] = useState(INITIAL_SCHEMES[2]);
  const [loading, setLoading] = useState(null);

  const handleApply = (schemeId) => {
    setLoading(schemeId);
    setTimeout(() => {
      setSchemes(prev => prev.map(s => {
        if (s.id === schemeId) {
          const updated = { ...s, status: 'In Progress' };
          setActiveScheme(updated);
          return updated;
        }
        return s;
      }));
      setLoading(null);
    }, 1200); // realistic loading feedback
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 font-display">
          {t('schemesTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {t('schemesSub')}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Column: Scheme Cards List (Span 7) */}
        <div className="md:col-span-7 space-y-4">
          {schemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setActiveScheme(scheme)}
              className={`w-full p-5 rounded-3xl border text-left transition duration-200 cursor-pointer block relative ${activeScheme.id === scheme.id ? 'bg-emerald-50/50 border-emerald-400 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{scheme.category}</span>
                  <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">{scheme.name}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${scheme.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : scheme.status === 'In Progress' ? 'bg-yellow-50 text-yellow-800 border-yellow-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {scheme.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-3 line-clamp-2">
                {scheme.benefits}
              </p>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Due: {scheme.deadline}</span>
                <span className="hover:underline flex items-center gap-0.5 text-emerald-700">View Qualification Criteria <ArrowRight className="w-3 h-3" /></span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Active Scheme Detail Card (Span 5) */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-left h-full flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-3 mb-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{activeScheme.category}</span>
                <h4 className="text-lg font-bold text-slate-900 font-display mt-0.5">{activeScheme.name}</h4>
              </div>

              {/* Sub sections */}
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">{t('schemeBenefits')}</h5>
                  <p className="text-slate-700 font-semibold">{activeScheme.benefits}</p>
                </div>

                <div>
                  <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">{t('schemeEligibility')}</h5>
                  <p className="text-slate-700 font-semibold">{activeScheme.eligibility}</p>
                </div>

                <div>
                  <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">{t('schemeDocuments')}</h5>
                  <ul className="space-y-1.5 pl-1">
                    {activeScheme.documentsRequired.map((doc, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2 text-slate-700 font-semibold">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Apply Action Buttons */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              {activeScheme.status === 'Approved' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Subsidy Approved & Settled</span>
                </div>
              ) : activeScheme.status === 'In Progress' ? (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-center gap-2 text-yellow-800 font-bold text-xs animate-pulse">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span>Application Under Official Audit</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApply(activeScheme.id)}
                  disabled={loading === activeScheme.id}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition border border-emerald-500 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-55"
                >
                  {loading === activeScheme.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting Digital Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-100 animate-pulse" />
                      <span>Submit Digital Sowing Application</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
