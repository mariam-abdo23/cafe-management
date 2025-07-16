import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Staff() {
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: '',
    position: '',
    salary: '',
    shift_time: '',
    id: null,
  });

  useEffect(() => {
    fetchProfiles();
    fetchUsers();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.data.sort((a, b) => a.user?.name?.localeCompare(b.user?.name));
      setProfiles(sorted);
    } catch (err) {
      Swal.fire('Error', 'Failed to load staff profiles', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/users/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      Swal.fire('Error', 'Failed to load users', 'error');
    }
  };

  const handleEdit = (profile) => {
    setForm({
      user_id: profile.user?.id || '',
      position: profile.position,
      salary: profile.salary,
      shift_time: profile.shift_time,
      id: profile.id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the staff profile.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', '', 'success');
        fetchProfiles();
        fetchUsers();
      } catch (err) {
        Swal.fire('Error', 'Something went wrong while deleting', 'error');
      }
    }
  };

  const resetForm = () => {
    setForm({ user_id: '', position: '', salary: '', shift_time: '', id: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: form.user_id,
      position: form.position.trim(),
      salary: parseFloat(form.salary),
      shift_time: form.shift_time.trim(),
    };

    if (!payload.user_id || !payload.position || payload.salary <= 0 || !payload.shift_time) {
      Swal.fire('Validation Error', 'Please fill all fields correctly', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (form.id) {
        await axios.put(`/staff/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Updated!', 'Staff profile updated successfully', 'success');
      } else {
        await axios.post('/staff', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Created!', 'New staff profile added', 'success');
      }

      resetForm();
      fetchProfiles();
      fetchUsers();
    } catch (err) {
      Swal.fire('Error', 'Something went wrong while saving', 'error');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#fef9f4] to-[#f3e5dc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mt-34 mb-6 text-[#5d4037]">👥 Manage Staff</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-[#d7ccc8] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="p-3 border border-[#bcaaa4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Position (e.g., Chef, Waiter...)"
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />

            <input
              type="number"
              placeholder="Monthly Salary"
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />

            <input
              type="text"
              placeholder="Shift Time (e.g., 9am - 5pm)"
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.shift_time}
              onChange={(e) => setForm({ ...form, shift_time: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#6d4c41] text-white py-3 rounded-md hover:bg-[#5d4037] transition"
          >
            {form.id ? '✏ Update Staff' : '➕ Add Staff'}
          </button>
        </form>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-5 rounded-xl border border-[#d7ccc8] shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-[#6d4c41] mb-1">{profile.user?.name}</h3>
              <p className="text-sm text-[#5d4037]">📍 Position: {profile.position}</p>
              <p className="text-sm text-[#5d4037]">💵 Salary: {profile.salary} EGP</p>
              <p className="text-sm text-[#5d4037]">🕒 Shift: {profile.shift_time}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(profile)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
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
