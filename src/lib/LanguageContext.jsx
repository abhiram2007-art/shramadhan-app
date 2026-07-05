/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations.js';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  // Load initial language preference from localStorage or default to English
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('agriwise_lang');
    if (saved === 'en' || saved === 'hi' || saved === 'te') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('agriwise_lang', lang);
  };

  // Translation helper function
  const t = (key) => {
    const activeDict = translations[language];
    if (activeDict && activeDict[key]) {
      return activeDict[key];
    }
    // Fallback to English key if not found
    return translations['en'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
