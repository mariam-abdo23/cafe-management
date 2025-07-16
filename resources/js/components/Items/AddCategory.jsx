import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faCheck,
  faXmark,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function AddCategory() {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error('❌ Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim().length < 3) {
      Swal.fire(t('category.validationTitle'), t('category.nameTooShort'), 'warning');
      return;
    }

    try {
      await axios.post('/categories', { name });
      setName('');
      fetchCategories();
      Swal.fire(t('category.createdTitle'), t('category.createdSuccess'), 'success');
    } catch (err) {
      console.error(err);
      Swal.fire(t('category.errorTitle'), t('category.createdFailed'), 'error');
    }
  };

  const handleEditStart = (cat) => {
    setEditingId(cat.id);
    setEditedName(cat.name);
  };

  const handleEditSave = async () => {
    if (!editedName.trim() || editedName.trim().length < 3) {
      Swal.fire({
        icon: 'warning',
        title: t('category.validationTitle'),
        text: t('category.nameTooShort'),
      });
      return;
    }

    try {
      await axios.put(`/categories/${editingId}`, { name: editedName });
      setEditingId(null);
      setEditedName('');
      fetchCategories();
      Swal.fire(t('category.updatedTitle'), t('category.updatedSuccess'), 'success');
    } catch (err) {
      console.error(err);
      Swal.fire(t('category.errorTitle'), t('category.updatedFailed'), 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: t('category.deleteConfirmTitle'),
      text: t('category.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('category.confirmDelete'),
      cancelButtonText: t('category.cancel'),
      confirmButtonColor: '#d33',
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`/categories/${id}`);
        fetchCategories();
        Swal.fire(t('category.deletedTitle'), t('category.deletedSuccess'), 'success');
      } catch (err) {
        console.error(err);
        Swal.fire(t('category.errorTitle'), t('category.deletedFailed'), 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName('');
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc] px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-[#6d4c41] mb-6">
        <FontAwesomeIcon icon={faTags} className="mr-2 text-[#8b4513]" />
        {t('category.title')}
      </h2>

      {/* ✅ Category List */}
      <div className="max-w-4xl mx-auto mb-10">
        {loading ? (
          <p className="text-sm text-center text-gray-500">⏳ {t('category.loading')}</p>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 mt-6 px-2 max-h-[300px] overflow-y-auto">
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  className="bg-[#fff4e6] text-[#5d4037] px-4 py-2 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-2 shadow w-full sm:w-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {editingId === cat.id ? (
                    <>
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-sm px-2 py-1 border rounded"
                      />
                      <div className="flex gap-1">
                        <button onClick={handleEditSave} className="text-green-600 hover:text-green-800">
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800">
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{cat.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStart(cat)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* ✅ Add Form */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto border border-amber-100">
        <h3 className="text-xl font-bold text-center text-[#8b4513] mb-6">{t('category.formTitle')}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">{t('category.label')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('category.placeholder')}
              className="w-full px-4 py-2 border rounded-xl border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#8b4513] text-white font-semibold py-2 rounded-xl hover:bg-amber-600 transition"
          >
            {t('category.addButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
