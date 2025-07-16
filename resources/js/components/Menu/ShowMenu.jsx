import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ShowMenu() {
  const { t } = useTranslation('show_menu');
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`items/${id}`);
      setItem(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch item:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-500">⏳ {t('show-menu.loading')}</p>;
  }

  if (!item) {
    return <p className="text-center mt-20 text-red-500">🚫 {t('show-menu.not_found')}</p>;
  }

  return (
    <div className="min-h-screen bg-[#fefae0] flex justify-center items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-[#f0e6d2]"
      >
        <h2 className="text-2xl font-bold text-[#6d4c41] mb-4">{item.name}</h2>
        <p className="text-[#8b4513] font-semibold mb-2">💰 {t('show-menu.price')}: {item.price} EGP</p>
        <p className="text-gray-700 mb-2">
          🏷 {t('show-menu.category')}: <span className="font-medium">{item.category?.name}</span>
        </p>
        <p className="mb-2">
          {item.available ? '✅ ' + t('show-menu.available') : '❌ ' + t('show-menu.not_available')}
        </p>
        {item.description && (
          <p className="text-sm text-gray-600 mt-4">{item.description}</p>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full bg-[#8b4513] text-white py-2 rounded-xl hover:bg-[#a76e3c] transition"
        >
          {t('show-menu.back')}
        </button>
      </motion.div>
    </div>
  );
}
