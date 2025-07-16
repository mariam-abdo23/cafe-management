import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { t } = useTranslation(); // ✅ استخدام الترجمة

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/reservations');
      setReservations(res.data.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      Swal.fire('Error', t('adminReservations.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: t('adminReservations.confirmDeleteTitle'),
      text: t('adminReservations.confirmDeleteText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: t('adminReservations.confirmButton'),
      cancelButtonText: t('adminReservations.cancelButton'),
    });

    if (confirm.isConfirmed) {
      try {
        setActionLoading(true);
        await axios.delete(`/reservations/${id}`);
        Swal.fire(t('adminReservations.deleted'), t('adminReservations.deletedSuccess'), 'success');
        fetchReservations();
      } catch (err) {
        Swal.fire('Error!', t('adminReservations.deletedError'), 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setActionLoading(true);
      await axios.put(`/reservations/${id}`, { status: newStatus });
      Swal.fire(t('adminReservations.updated'), t('adminReservations.statusUpdated'), 'success');
      fetchReservations();
    } catch (err) {
      Swal.fire('Error!', t('adminReservations.statusError'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'confirmed':
        return t('adminReservations.confirmed');
      case 'cancelled':
        return t('adminReservations.cancelled');
      default:
        return t('adminReservations.pending');
    }
  };

  return (
    <div className="p-4 mt-24">
      <h2 className="text-2xl font-bold text-[#5d4037] mb-6 text-center">
        📋 {t('adminReservations.title')}
      </h2>

      {loading ? (
        <p className="text-center text-sm text-gray-500">{t('adminReservations.loading')}</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-gray-500">{t('adminReservations.noReservations')}</p>
      ) : (
        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white shadow-md rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <thead className="bg-[#d7ccc8] text-[#3e2723]">
              <tr>
                <th className="p-3">{t('adminReservations.user')}</th>
                <th className="p-3">{t('adminReservations.table')}</th>
                <th className="p-3">{t('adminReservations.time')}</th>
                <th className="p-3">{t('adminReservations.duration')}</th>
                <th className="p-3">{t('adminReservations.notes')}</th>
                <th className="p-3">{t('adminReservations.status')}</th>
                <th className="p-3">{t('adminReservations.actions')}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {reservations.map((rsv) => (
                  <motion.tr
                    key={rsv.id}
                    className="border-b text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="p-3">{rsv.user?.name}</td>
                    <td className="p-3">{rsv.dining_table?.name}</td>
                    <td className="p-3">{formatDate(rsv.reservation_time)}</td>
                    <td className="p-3">{rsv.duration_minutes} {t('adminReservations.minutes')}</td>
                    <td className="p-3">{rsv.notes || '—'}</td>
                    <td className={`p-3 font-semibold ${getStatusColor(rsv.status)}`}>
                      {translateStatus(rsv.status)}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleStatusChange(rsv.id, 'confirmed')}
                        className="text-green-600 hover:text-green-800"
                        title={t('adminReservations.confirm')}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(rsv.id, 'cancelled')}
                        className="text-yellow-600 hover:text-yellow-800"
                        title={t('adminReservations.cancel')}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <button
                        onClick={() => handleDelete(rsv.id)}
                        className="text-red-600 hover:text-red-800"
                        title={t('adminReservations.delete')}
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
}
