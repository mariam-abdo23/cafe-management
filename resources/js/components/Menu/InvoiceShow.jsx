import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBill,
  faClock,
  faCreditCard,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

export default function InvoiceShow() {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/invoices/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoice(res.data.data.invoice);
    } catch (err) {
      console.error('Failed to fetch invoice:', err);
    }
  };

  if (!invoice) {
    return <div className="text-center mt-10 text-[#6d4c41] font-semibold">Loading invoice...</div>;
  }

  const getStatusColor = (status) => {
    return status === 'paid' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen px-4 py-16 bg-[#fff8e1] text-[#4e342e]">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#6d4c41]">
        <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
        Invoice Details
      </h1>

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-[#ffecb3]">
        <p className="mb-4 font-semibold text-lg">
          <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-[#6d4c41]" />
          Amount: <span className="text-[#388e3c]">{invoice.amount} EGP</span>
        </p>

        <p className="mb-4 font-semibold text-lg capitalize">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-[#6d4c41]" />
          Payment Method: {invoice.payment_method === 'cash' ? 'Cash' : invoice.payment_method === 'card' ? 'Card' : 'Online'}
        </p>

        <p className={`mb-4 font-semibold text-lg flex items-center gap-2 ${getStatusColor(invoice.status)}`}>
          <FontAwesomeIcon icon={faClock} className="text-[#6d4c41]" />
          Status: {invoice.status}
        </p>

        <p className="text-sm text-gray-600 mt-4">
          Created at: {new Date(invoice.created_at).toLocaleString()}
        </p>
      </div>

      {/* Back + Print Buttons */}
      <div className="flex justify-center gap-4 mt-10 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#ff7043] text-white px-6 py-2 rounded-lg shadow hover:bg-[#f4511e] transition flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
        >
          🖨️ Print Invoice
        </button>
      </div>
    </div>
  );
}
