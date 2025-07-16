import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export default function InvoicesDashboard() {
  const { t } = useTranslation('invoices');
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  const handleStatusToggle = async (invoice) => {
    const newStatus = invoice.status === 'paid' ? 'unpaid' : 'paid';
    const confirm = await Swal.fire({
      title: t('invoices.confirm_change_title', { status: newStatus }),
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
          title: t('invoices.success_update'),
        });

        setInvoices((prev) =>
          prev.map((item) =>
            item.id === invoice.id ? { ...item, status: newStatus } : item
          )
        );
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: t('error_update'),
        });
        console.error(err);
      }
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.order?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#fff3e0] min-h-screen">
      <h1 className="text-3xl font-bold text-[#6d4c41] mb-6">{t('invoices.title')}</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('invoices.search_placeholder')}
          className="px-4 py-2 w-full max-w-md border border-[#ccc] rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto shadow rounded-xl border border-[#ffe0b2]">
        <table className="min-w-full bg-white">
          <thead className="bg-[#ffe0b2] text-[#4e342e]">
            <tr>
              <th className="py-3 px-4 text-left">{t('invoices.table.id')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.amount')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.status')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.payment_method')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.customer')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.phone')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.order_type')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.created_at')}</th>
              <th className="py-3 px-4 text-left">{t('invoices.table.action')}</th>
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
                    {t(`invoices.status.${invoice.status}`)}
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
                    {t('invoices.table.change_status')}
                  </button>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-[#a1887f]">
                  {t('invoices.no_results')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
