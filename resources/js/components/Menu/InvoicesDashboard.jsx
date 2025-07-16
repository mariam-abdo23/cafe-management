import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';

export default function InvoicesDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fetch all invoices from API
  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/invoices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoices(res.data.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  // Toggle status between 'paid' and 'unpaid'
  const handleStatusToggle = async (invoice) => {
    const newStatus = invoice.status === 'paid' ? 'unpaid' : 'paid';
    const confirm = await Swal.fire({
      title: `Are you sure you want to change the status to "${newStatus}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `/invoices/${invoice.id}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Status updated successfully ✅',
        });

        // Update the status in UI immediately
        setInvoices((prev) =>
          prev.map((item) =>
            item.id === invoice.id ? { ...item, status: newStatus } : item
          )
        );
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'An error occurred ❌',
        });
        console.error(err);
      }
    }
  };

  // Filter invoices by customer name
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.order?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#fff3e0] min-h-screen">
      <h1 className="text-3xl font-bold text-[#6d4c41] mb-6">💼 Payment Management</h1>

      {/* 🔍 Search by customer name */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by customer name..."
          className="px-4 py-2 w-full max-w-md border border-[#ccc] rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🧾 Invoice Table */}
      <div className="overflow-x-auto shadow rounded-xl border border-[#ffe0b2]">
        <table className="min-w-full bg-white">
          <thead className="bg-[#ffe0b2] text-[#4e342e]">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Payment Method</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Order Type</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-[#4e342e]">
            {filteredInvoices.map((invoice, index) => (
              <tr key={invoice.id} className="border-t border-[#ffe0b2] hover:bg-[#fff8e1]">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{invoice.amount} EGP</td>
                <td className="py-2 px-4 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      invoice.status === 'paid' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="py-2 px-4 capitalize">{invoice.payment_method}</td>
                <td className="py-2 px-4 capitalize">{invoice.order?.user?.name || '—'}</td>
                <td className="py-2 px-4">{invoice.order?.user?.phone || '—'}</td>
                <td className="py-2 px-4 capitalize">{invoice.order?.order_type || '—'}</td>
                <td className="py-2 px-4">
                  {new Date(invoice.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleStatusToggle(invoice)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}

            {/* No results message */}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-[#a1887f]">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
