import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Select from 'react-select';


export default function AdminShifts() {
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    name: '',
    start_time: '',
    end_time: '',
    shift_date: '',
    user_ids: [],
    id: null,
  });

  useEffect(() => {
    fetchShifts();
    fetchStaff();
  }, []);

  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/shifts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/users/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (shift) => {
    const shiftDateFromPivot = shift.users.length > 0 ? shift.users[0].pivot?.shift_date : '';

    setForm({
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
      shift_date: shiftDateFromPivot,
      user_ids: shift.users.map((u) => u.id),
      id: shift.id,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this shift.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/shifts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', '', 'success');
        fetchShifts();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Could not delete shift', 'error');
      }
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    name: form.name.trim(),
    start_time: form.start_time?.slice(0, 5),
    end_time: form.end_time?.slice(0, 5),
    shift_date: form.user_ids.length > 0 ? form.shift_date : null,
    user_ids: form.user_ids,
  };

  // ✅ اطبعي البايلود للتأكد من القيم
  console.log('📦 Payload:', payload);

  if (!payload.name || !payload.start_time || !payload.end_time || (payload.user_ids.length > 0 && !payload.shift_date)) {
    Swal.fire('Validation Error', 'Please fill all fields', 'error');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    let res;

    if (form.id) {
      res = await axios.put(`/shifts/${form.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Updated', 'Shift updated successfully!', 'success');
    } else {
      res = await axios.post('/shifts', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire('Created', 'Shift added successfully!', 'success');
    }

    setForm({ name: '', start_time: '', end_time: '', shift_date: '', user_ids: [], id: null });
    fetchShifts();
  } catch (err) {
   console.error('❌ Error:', err.response?.data);
Swal.fire('Validation Error', JSON.stringify(err.response?.data?.errors || {}), 'error');

    Swal.fire(
      'Error',
      JSON.stringify(err.response?.data.errors || err.response?.data.message),
      'error'
    );
  }
};


   

  return (
    <div className="p-6 bg-gradient-to-br from-[#fef9f4] to-[#f3e5dc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center mt-34 text-[#5d4037]">☕ Manage Shifts</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-[#d7ccc8]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Shift Name"
              className="p-3 border border-[#bcaaa4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="time"
              name="start_time"
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
            <input
              type="time"
              name="end_time"
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            />
            <input
              type="date"
              name="shift_date"
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.shift_date}
              onChange={(e) => setForm({ ...form, shift_date: e.target.value })}
            />
            <div className="col-span-full">
              <Select
                isMulti
                name="user_ids"
                options={staff.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Staff..."
                value={staff
                  .filter((u) => form.user_ids.includes(u.id))
                  .map((u) => ({ value: u.id, label: u.name }))}
                onChange={(selected) => {
                  const selectedIds = selected.map((s) => s.value);
                  setForm({ ...form, user_ids: selectedIds });
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-[#6d4c41] text-white py-3 rounded-md hover:bg-[#5d4037] transition"
          >
            {form.id ? '✏ Update Shift' : '➕ Add Shift'}
          </button>
        </form>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white p-5 rounded-lg border border-[#d7ccc8] shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-[#4e342e] mb-2">{shift.name}</h3>
              <p className="text-sm text-[#5d4037]">🕘 {shift.start_time} - {shift.end_time}</p>
              <p className="text-sm text-[#5d4037]">📅 Shift Date: {shift.shift_date || 'N/A'}</p>
              <p className="text-sm font-medium mt-2 text-[#5d4037]">👥 Staff:</p>
              <ul className="list-disc ml-5 text-sm text-[#6d4c41]">
                {shift.users?.length ? shift.users.map((u) => <li key={u.id}>{u.name}</li>) : <li>No staff</li>}
              </ul>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(shift)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(shift.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
