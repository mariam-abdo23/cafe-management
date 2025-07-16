import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ItemShow() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`/items/${id}`);
      setItem(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch item:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex justify-center items-center bg-[#f5f5dc]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-500">{t('item_show.loading')}</p>
      </motion.div>
    );
  }

  if (!item) {
    return (
      <motion.div
        className="min-h-screen flex justify-center items-center bg-[#f5f5dc]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-red-500">{t('item_show.item_not_found')}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#f5f5dc] px-4 py-16 flex justify-center items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg mt-38 border border-[#f0e5d8]"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-[#8b4513] mb-6 text-center">
          🍽 {item.name}
        </h2>
        <div className="space-y-4 text-[#5d4037] text-lg">
          <p>
            <strong>💬 {t('item_show.description_label')}:</strong>{' '}
            {item.description || t('item_show.no_description')}
          </p>
          <p>
            <strong>💰 {t('item_show.price_label')}:</strong>{' '}
            {t('item_show.egp_currency', { price: item.price })}
          </p>
          <p>
            <strong>📦 {t('item_show.available_label')}:</strong>{' '}
            {item.available ? '✅ ' + t('item_show.yes') : '❌ ' + t('item_show.no')}
          </p>
          <p>
            <strong>📁 {t('item_show.category_label')}:</strong>{' '}
            {item.category?.name || t('item_show.no_category')}
          </p>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-[#8b4513] mb-2">
                🧂 {t('item_show.ingredients_label')}:
              </h3>
              <ul className="list-disc list-inside text-[#5d4037] space-y-1">
                {item.ingredients.map((ing) => (
                  <li key={ing.id}>
                    {ing.name} - {ing.quantity} {ing.unit || ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-8 w-full bg-[#8b4513] text-white py-2 rounded-xl hover:bg-amber-600 transition"
        >
          ⬅ {t('item_show.back_button')}
        </button>
      </motion.div>
    </motion.div>
  );
}