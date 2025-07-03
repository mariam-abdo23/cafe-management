import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/reservations');
      setReservations(res.data.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      Swal.fire('Error', 'Could not load reservations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This reservation will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        setActionLoading(true);
        await axios.delete(`/reservations/${id}`);
        Swal.fire('Deleted!', 'Reservation was deleted successfully.', 'success');
        fetchReservations();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete reservation.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setActionLoading(true);
      await axios.put(`/reservations/${id}`, { status: newStatus });
      Swal.fire('Updated!', 'Reservation status updated.', 'success');
      fetchReservations();
    } catch (err) {
      Swal.fire('Error!', 'Failed to update status.', 'error');
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
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="p-4 mt-24">
      <h2 className="text-2xl font-bold text-[#5d4037] mb-6 text-center">
        📋 Reservations Management
      </h2>

      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-gray-500">No reservations found.</p>
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
                <th className="p-3">User</th>
                <th className="p-3">Table</th>
                <th className="p-3">Time</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
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
                    <td className="p-3">{rsv.duration_minutes} mins</td>
                    <td className="p-3">{rsv.notes || '—'}</td>
                    <td className={`p-3 font-semibold ${getStatusColor(rsv.status)}`}>
                      {translateStatus(rsv.status)}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleStatusChange(rsv.id, 'confirmed')}
                        className="text-green-600 hover:text-green-800"
                        title="Confirm"
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(rsv.id, 'cancelled')}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Cancel"
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                      <button
                        onClick={() => handleDelete(rsv.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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