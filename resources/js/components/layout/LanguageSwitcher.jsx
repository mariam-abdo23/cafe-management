import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-amber-100 text-[#6d4c41] px-3 py-2 rounded-full shadow-md hover:bg-amber-200 transition"
    >
      <FaGlobe className="text-lg" />
      <span className="font-semibold">{i18n.language === 'ar' ? 'EN' : 'ع'}</span>
    </button>
  );
}
