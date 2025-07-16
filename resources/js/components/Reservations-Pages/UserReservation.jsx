
import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';


export default function UserReservation() {
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
      Swal.fire('Error', 'Could not fetch tables.', 'error');
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
    if (!diningTableId) newErrors.diningTableId = 'Please select a table';
    if (!reservationTime) newErrors.reservationTime = 'Reservation time is required';
    if (!durationMinutes) newErrors.durationMinutes = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
// ------ -----------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const selectedTable = tables.find((t) => t.id === Number(diningTableId));
  if (selectedTable?.status !== 'available' && !editingId) {
    Swal.fire('Unavailable', 'This table is not available for reservation.', 'warning');
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
      Swal.fire('Updated', 'Reservation updated successfully!', 'success');
    } else {
const res = await axios.post('/reservations', {
  dining_table_id: Number(diningTableId),
  reservation_time: reservationTime,
  duration_minutes: durationMinutes,
  notes,
});


reservationId = res.data?.data?.reservation?.id;

Swal.fire('Reservation Submitted ✅', 'Reservation created successfully!', 'success');

    }

    console.log('reservationId:', reservationId);
    console.log('selectedItem:', selectedItem);

    if (!editingId && selectedItem && reservationId) {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      console.log('🚀 Data to send:', {
  order_type: 'dine_in',
  dining_table_id: Number(diningTableId),
  reservation_id: reservationId,
  status: 'pending',
  items: [{ id: selectedItem.id, quantity: quantity }],
});

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



      Swal.fire('Order Added ✅', 'Order created successfully after reservation.', 'success');

      
      navigate('/my-orders');
    }

    resetForm();
    await updateTableStatuses();
  } catch (err) {
    console.error('Error saving reservation or order:', err);
    Swal.fire('Error', 'Failed to save reservation or order.', 'error');
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
      title: 'Are you sure?',
      text: 'This reservation will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/reservations/${id}`);
        Swal.fire('Deleted!', 'Reservation deleted successfully.', 'success');
        await updateTableStatuses();
      } catch {
        Swal.fire('Error', 'Failed to delete reservation.', 'error');
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
      {/* Table Status */}
      <section className="max-w-5xl mx-auto mb-8">
        <h3 className="text-xl font-semibold text-[#5d4037] mb-4 text-center ">Table Status</h3>
        <div className="flex justify-center mb-4">
          <button
            onClick={updateTableStatuses}
            className="bg-[#8b4513] text-white px-4 py-2 rounded hover:bg-[#5d4037] transition"
          >
            Update Table Statuses
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

      {/* Form & Reservations */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#5d4037]">
            {editingId ? 'Edit Reservation' : 'Reserve a Table'}
          </h2>

          <label className="block mb-1 text-sm text-[#5d4037]">Select Table:</label>
          <select
            value={diningTableId}
            onChange={(e) => setDiningTableId(e.target.value)}
            className="w-full p-2 mb-1 border rounded"
          >
            <option value="">-- Choose a table --</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} ({table.status})
              </option>
            ))}
          </select>
          {errors.diningTableId && <p className="text-red-500 text-sm mb-2">{errors.diningTableId}</p>}

          <label className="block mb-1 text-sm text-[#5d4037]">Reservation Time:</label>
          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className="w-full p-2 mb-1 border rounded"
          />
          {errors.reservationTime && <p className="text-red-500 text-sm mb-2">{errors.reservationTime}</p>}

          <label className="block mb-1 text-sm text-[#5d4037]">Duration (minutes):</label>
          <input
            type="number"
            min={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full p-2 mb-1 border rounded"
          />
          {errors.durationMinutes && <p className="text-red-500 text-sm mb-2">{errors.durationMinutes}</p>}

          <label className="block mb-1 text-sm text-[#5d4037]">Notes (optional):</label>
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
            {editingId ? 'Update Reservation' : 'Submit Reservation'}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="w-full mt-2 bg-gray-200 text-[#5d4037] py-2 rounded hover:bg-gray-300"
          >
            Reset Form
          </button>
        </form>

        {/* Reservation List */}
        <section className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h3 className="text-lg font-semibold mb-3 text-center text-[#5d4037]">Your Reservations</h3>
          {paginatedReservations.map((res) => (
            <div key={res.id} className="border p-4 rounded-xl mb-2 bg-white shadow-sm">
              <p className="text-sm">Table: {res.dining_table?.name}</p>
              <p className="text-sm">Time: {new Date(res.reservation_time).toLocaleString()}</p>
              <p className="text-sm">Duration: {res.duration_minutes} mins</p>
              <p className={`text-sm font-semibold ${getStatusColor(res.status)}`}>Status: {res.status}</p>
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

          {/* Pagination */}
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