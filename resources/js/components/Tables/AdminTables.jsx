
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faChair,
  faCircleCheck,
  faCircleXmark,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', status: 'available' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get('/dining-tables');
      setTables(res.data.data);
    } catch (err) {
      console.error('❌ Error fetching tables', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/dining-tables/${id}`);
        fetchTables();
        Swal.fire('Deleted!', 'Table has been deleted.', 'success');
      } catch (err) {
        console.error('❌ Error deleting table', err);
        Swal.fire('Error!', 'Failed to delete the table.', 'error');
      }
    }
  };

  const handleEdit = (table) => {
    setFormData({ name: table.name, status: table.status });
    setEditingId(table.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', status: 'available' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Table name must be at least 3 characters.',
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/dining-tables/${editingId}`, formData);
        Swal.fire('Updated!', 'Table has been updated successfully.', 'success');
      } else {
        await axios.post('/dining-tables', formData);
        Swal.fire('Created!', 'New table has been added.', 'success');
      }

      setFormData({ name: '', status: 'available' });
      setEditingId(null);
      fetchTables();
    } catch (err) {
      console.error('❌ Error saving table', err);
      Swal.fire('Error!', 'Something went wrong while saving the table.', 'error');
    }
  };

  const filteredTables = tables.filter((t) => {
    const matchesStatus = filter === 'all' || t.status === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusIcon = {
    available: faCircleCheck,
    occupied: faCircleXmark,
    reserved: faClock,
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-[#6d4c41] mt-24 mb-8">🪑 Manage Tables</h2>

      {/* 🔎 Search + Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by table name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm w-full max-w-xs"
        />

        {['all', 'available', 'occupied', 'reserved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
              filter === status
                ? 'bg-[#8b4513] text-white'
                : 'bg-white border-[#8b4513] text-[#8b4513]'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* 📊 Count */}
      <div className="text-center text-gray-700 font-medium mb-4">
        Showing {filteredTables.length} of {tables.length} {tables.length === 1 ? 'table' : 'tables'}
      </div>

      {/* 🪑 Table Cards */}
      {loading ? (
        <p className="text-center text-sm text-gray-500">⏳ Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredTables.map((table) => (
            <motion.div
              key={table.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <FontAwesomeIcon icon={faChair} className="text-[#8b4513] text-2xl" />
                <h3 className="text-lg font-semibold text-[#5d4037]">{table.name}</h3>
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                <FontAwesomeIcon
                  icon={statusIcon[table.status]}
                  className={`${
                    table.status === 'available'
                      ? 'text-green-600'
                      : table.status === 'occupied'
                      ? 'text-red-600'
                      : 'text-yellow-500'
                  }`}
                />
                <span className="capitalize">{table.status}</span>
              </p>

              <div className="flex justify-end gap-4 text-sm">
                <button
                  onClick={() => handleEdit(table)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

   
      <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-xl border border-amber-100">
        <h2 className="text-xl font-bold text-center text-[#6d4c41] mb-4">
          {editingId ? '✏ Edit Table' : '➕ Add Table'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-4 py-2 rounded-xl border-gray-300"
              placeholder="Enter table name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border px-4 py-2 rounded-xl border-gray-300"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="w-full bg-[#8b4513] text-white font-semibold py-2 rounded-xl hover:bg-amber-600 transition"
            >
              {editingId ? 'Update Table' : 'Add Table'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}