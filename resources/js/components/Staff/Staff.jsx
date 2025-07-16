import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Staff() {
  const { t } = useTranslation('staff');
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
      Swal.fire(t('staff.error_title'), t('staff.load_profiles_error'), 'error');
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
      Swal.fire(t('staff.error_title'), t('staff.load_users_error'), 'error');
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
      title: t('staff.delete_confirm_title'),
      text: t('staff.delete_confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('staff.delete_confirm_btn'),
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire(t('staff.delete_success_title'), '', 'success');
        fetchProfiles();
        fetchUsers();
      } catch (err) {
        Swal.fire(t('staff.delete_error_title'), t('staff.delete_error_message'), 'error');
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
      Swal.fire(t('staff.validation_title'), t('staff.validation_message'), 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (form.id) {
        await axios.put(`/staff/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire(t('staff.updated_title'), t('staff.updated_message'), 'success');
      } else {
        await axios.post('/staff', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire(t('staff.created_title'), t('staff.created_message'), 'success');
      }

      resetForm();
      fetchProfiles();
      fetchUsers();
    } catch (err) {
      Swal.fire(t('staff.error_title'), t('staff.error_message'), 'error');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#fef9f4] to-[#f3e5dc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mt-34 mb-6 text-[#5d4037]">
          {t('staff.page_title')}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md border border-[#d7ccc8] mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="p-3 border border-[#bcaaa4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8d6e63]"
            >
              <option value="">{t('staff.form.select_user')}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder={t('staff.form.position')}
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />

            <input
              type="number"
              placeholder={t('staff.form.salary')}
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />

            <input
              type="text"
              placeholder={t('staff.form.shift_time')}
              className="p-3 border border-[#bcaaa4] rounded-md"
              value={form.shift_time}
              onChange={(e) => setForm({ ...form, shift_time: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#6d4c41] text-white py-3 rounded-md hover:bg-[#5d4037] transition"
          >
            {form.id ? t('staff.form.update_btn') : t('staff.form.add_btn')}
          </button>
        </form>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-5 rounded-xl border border-[#d7ccc8] shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-[#6d4c41] mb-1">
                {profile.user?.name}
              </h3>
              <p className="text-sm text-[#5d4037]">
                {t('staff.position')}: {profile.position}
              </p>
              <p className="text-sm text-[#5d4037]">
                {t('staff.salary')}: {profile.salary} EGP
              </p>
              <p className="text-sm text-[#5d4037]">
                {t('staff.shift')}: {profile.shift_time}
              </p>
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