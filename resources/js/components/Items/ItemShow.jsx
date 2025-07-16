import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { motion } from 'framer-motion';

export default function ItemShow() {
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
        <p className="text-gray-500">⏳ Loading...</p>
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
        <p className="text-red-500">❌ Item not found.</p>
      </motion.div>
    );
  }

  return <>
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
        <h2 className="text-3xl font-bold text-[#8b4513] mb-6 text-center">🍽 {item.name}</h2>
        <div className="space-y-4 text-[#5d4037] text-lg">
          <p><strong>💬 Description:</strong> {item.description || 'No description provided.'}</p>
          <p><strong>💰 Price:</strong> {item.price} EGP</p>
          <p><strong>📦 Available:</strong> {item.available ? '✅ Yes' : '❌ No'}</p>
          <p><strong>📁 Category:</strong> {item.category?.name || 'No category'}</p>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-[#8b4513] mb-2">🧂 Ingredients:</h3>
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
          ⬅ Back
        </button>
      </motion.div>
    </motion.div>
  </>
}
