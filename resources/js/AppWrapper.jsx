import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AppWrapper({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return children;
}
