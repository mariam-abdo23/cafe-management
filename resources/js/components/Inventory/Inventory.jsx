import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';

export default function Inventory() {
  const [inventories, setInventories] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [threshold, setThreshold] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const res = await axios.get('inventory');
      const allItems = res.data.data;
      setInventories(allItems);

      const low = allItems.filter(inv => inv.quantity < inv.threshold);
      setLowStockItems(low);
      setWarningVisible(low.length > 0);
    } catch (err) {
      console.error('Error fetching inventories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim() === '' || quantity === '' || parseInt(quantity) <= 0) {
      Swal.fire('Validation Error', 'Please enter valid name and quantity.', 'warning');
      return;
    }

    const payload = {
      name,
      quantity: parseInt(quantity),
      unit,
      threshold: parseInt(threshold || 10),
    };

    try {
      if (editingId) {
        await axios.put(`inventory/${editingId}`, payload);
        Swal.fire('Updated!', 'Inventory updated successfully', 'success');
      } else {
        await axios.post('inventory', payload);
        Swal.fire('Added!', 'Inventory item added successfully', 'success');
      }
      fetchInventories();
      setName('');
      setQuantity('');
      setUnit('kg');
      setThreshold('');
      setEditingId(null);
    } catch (err) {
      console.error('Error saving inventory:', err);
      Swal.fire('Error', 'Failed to save inventory item', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setThreshold(item.threshold);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the item.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`inventory/${id}`);
        fetchInventories();
        Swal.fire('Deleted!', 'Inventory item deleted', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete item', 'error');
      }
    }
  };

  const toggleFilter = () => {
    setFiltered(!filtered);
  };

  const displayedItems = filtered ? lowStockItems : inventories;

  return (
    <div className="min-h-screen bg-[#f5f5dc] px-4 py-10">
      <h2 className="text-3xl font-bold text-center mt-30 mb-6 text-[#6d4c41]">
        📦 Manage Inventory
      </h2>

      {warningVisible && (
        <div className="max-w-md mx-auto mb-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          ⚠️ Some inventory items are low! Check and restock soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-xl mb-4">{editingId ? '✏ Edit Inventory' : '➕ Add Inventory'}</h3>

        <input
          type="text"
          placeholder="Name"
          className="w-full border px-4 py-2 mb-3 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          className="w-full border px-4 py-2 mb-3 rounded-xl"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Unit (e.g. kg, g, L)"
          className="w-full border px-4 py-2 mb-3 rounded-xl"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <input
          type="number"
          placeholder="Threshold (optional)"
          className="w-full border px-4 py-2 mb-4 rounded-xl"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#8b4513] text-white py-2 rounded-xl hover:bg-amber-600"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">📋 Inventory List</h3>
          <button
            onClick={toggleFilter}
            className="bg-amber-200 px-4 py-1 rounded-xl text-sm hover:bg-amber-300"
          >
            {filtered ? 'Show All' : 'Show Low Stock Only'}
          </button>
        </div>

        <table className="w-full border bg-white rounded-xl overflow-hidden shadow">
          <thead className="bg-amber-100 text-left text-sm">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Threshold</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((inv) => (
              <tr
                key={inv.id}
                className={`border-t text-sm ${inv.quantity < inv.threshold ? 'bg-red-100' : ''}`}
              >
                <td className="p-2">{inv.name}</td>
                <td className="p-2">{inv.quantity}</td>
                <td className="p-2">{inv.unit}</td>
                <td className="p-2">{inv.threshold}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(inv)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(inv.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {displayedItems.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
