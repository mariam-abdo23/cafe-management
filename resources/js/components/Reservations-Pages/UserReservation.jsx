import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 



export default function UserReservation() {
  const { t } = useTranslation(); 
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [diningTableId, setDiningTableId] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const location = useLocation();
  const navigate = useNavigate();

  const selectedItem = location.state?.selectedItem || null;
  const quantity = location.state?.quantity || 1;

  useEffect(() => {
    fetchTables();
    fetchReservations();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get('dining-tables');
      setTables(res.data.data);
    } catch {
      Swal.fire('Error', t('reservation.deleteFailed'), 'error');
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/my-reservation');
      setReservations(res.data.data);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    }
  };

  const updateTableStatuses = async () => {
    try {
      await axios.get('/update-statuses');
      await fetchTables();
      await fetchReservations();
    } catch {
      console.error('Failed to update table statuses.');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!diningTableId) newErrors.diningTableId = t('reservation.validation.diningTableId');
    if (!reservationTime) newErrors.reservationTime = t('reservation.validation.reservationTime');
    if (!durationMinutes) newErrors.durationMinutes = t('reservation.validation.durationMinutes');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedTable = tables.find((t) => t.id === Number(diningTableId));
    if (selectedTable?.status !== 'available' && !editingId) {
      Swal.fire(t('reservation.unavailable'), '', 'warning');
      return;
    }

    try {
      let reservationId;

      if (editingId) {
        await axios.put(`/reservations/${editingId}`, {
          dining_table_id: Number(diningTableId),
          reservation_time: reservationTime,
          duration_minutes: durationMinutes,
          notes,
        });
        Swal.fire(t('reservation.reservationUpdated'), '', 'success');
      } else {
const res = await axios.post('/reservations', {
  dining_table_id: Number(diningTableId),
  reservation_time: reservationTime,
  duration_minutes: durationMinutes,
  notes,
  status: 'pending',
});


        reservationId = res.data?.data?.reservation?.id;

        Swal.fire(t('reservation.reservationSubmitted'), t('reservation.reservationCreated'), 'success');
      }

      if (!editingId && selectedItem && reservationId) {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        await axios.post(
          '/orders',
          {
            user_id: user?.id,
            order_type: 'dine_in',
            dining_table_id: Number(diningTableId),
            reservation_id: reservationId,
            status: 'pending',
            payment_method: 'cash',
            items: [
              {
                id: selectedItem.id,
                quantity: quantity,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire(t('reservation.orderAdded'), t('reservation.orderSuccess'), 'success');
        navigate('/my-orders');
      }

      resetForm();
      await updateTableStatuses();
    } catch (err) {
      console.error('Error saving reservation or order:', err);
      Swal.fire('Error', t('reservation.reservationFailed'), 'error');
    }
  };

  const resetForm = () => {
    setDiningTableId('');
    setReservationTime('');
    setDurationMinutes('');
    setNotes('');
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (res) => {
    setDiningTableId(res.dining_table_id);
    setReservationTime(res.reservation_time);
    setDurationMinutes(res.duration_minutes);
    setNotes(res.notes);
    setEditingId(res.id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: t('reservation.deleteConfirmTitle'),
      text: t('reservation.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('reservation.deleteConfirm'),
      cancelButtonText: t('reservation.cancel'),
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/reservations/${id}`);
        Swal.fire(t('reservation.deletedSuccess'), '', 'success');
        await updateTableStatuses();
      } catch {
        Swal.fire('Error', t('reservation.deleteFailed'), 'error');
      }
    }
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

  const paginatedReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fffbea] px-4 py-10">
      <section className="max-w-5xl mx-auto mb-8">
        <h3 className="text-xl font-semibold text-[#5d4037] mb-4 text-center ">
          {t('reservation.tableStatus')}
        </h3>
        <div className="flex justify-center mb-4">
          <button
            onClick={updateTableStatuses}
            className="bg-[#8b4513] text-white px-4 py-2 rounded hover:bg-[#5d4037] transition"
          >
            {t('reservation.updateTableStatuses')}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`rounded-xl shadow-md flex items-center justify-center text-center p-4 min-h-[100px] min-w-[100px] ${
                table.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : table.status === 'reserved'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {table.name} - {table.status}
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#5d4037]">
            {editingId ? t('reservation.formTitle.edit') : t('reservation.formTitle.create')}
          </h2>

          <label className="block mb-1 text-sm text-[#5d4037]">{t('reservation.selectTable')}</label>
          <select
            value={diningTableId}
            onChange={(e) => setDiningTableId(e.target.value)}
            className="w-full p-2 mb-1 border rounded"
          >
            <option value="">{t('reservation.chooseTable')}</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} ({table.status})
              </option>
            ))}
          </select>
          {errors.diningTableId && <p className="text-red-500 text-sm mb-2">{errors.diningTableId}</p>}

          <label className="block mb-1 text-sm text-[#5d4037]">{t('reservation.reservationTime')}</label>
          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full p-2 mb-1 border rounded"
          />
          {errors.reservationTime && <p className="text-red-500 text-sm mb-2">{errors.reservationTime}</p>}

          <label className="block mb-1 text-sm text-[#5d4037]">{t('reservation.duration')}</label>
          <input
            type="number"
            min={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full p-2 mb-1 border rounded"
          />
          {errors.durationMinutes && <p className="text-red-500 text-sm mb-2">{errors.durationMinutes}</p>}

          <label className="block mb-1 text-sm text-[#5d4037]">{t('reservation.notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            rows="3"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-[#8b4513] text-white py-2 rounded hover:bg-[#5d4037] transition"
          >
            {editingId ? t('reservation.update') : t('reservation.submit')}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="w-full mt-2 bg-gray-200 text-[#5d4037] py-2 rounded hover:bg-gray-300"
          >
            {t('reservation.reset')}
          </button>
        </form>

        <section className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h3 className="text-lg font-semibold mb-3 text-center text-[#5d4037]">
            {t('reservation.yourReservations')}
          </h3>
          {paginatedReservations.map((res) => (
            <div key={res.id} className="border p-4 rounded-xl mb-2 bg-white shadow-sm">
              <p className="text-sm">{t('reservation.table')}: {res.dining_table?.name}</p>
              <p className="text-sm">{t('reservation.time')}: {new Date(res.reservation_time).toLocaleString()}</p>
              <p className="text-sm">{t('reservation.durationText')}: {res.duration_minutes} mins</p>
              <p className={`text-sm font-semibold ${getStatusColor(res.status)}`}>
                {t(`reservation.statuses.${res.status}`)}

              </p>
              <div className="flex gap-2 mt-2 justify-end">
                <button onClick={() => handleEdit(res)} className="text-blue-600 hover:text-blue-800 text-sm">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(res.id)} className="text-red-600 hover:text-red-800 text-sm">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded border text-sm ${
                  currentPage === index + 1 ? 'bg-[#8b4513] text-white' : 'bg-white text-[#8b4513]'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
