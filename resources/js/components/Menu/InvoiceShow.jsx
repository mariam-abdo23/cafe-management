import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBill,
  faClock,
  faCreditCard,
  faArrowLeft,
  faChair,
  faMapMarkerAlt,
  faPhone,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';

export default function InvoiceShow() {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoiceAndOrder();
  }, []);

  const fetchInvoiceAndOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/invoices/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoice(res.data.data.invoice);
      setOrder(res.data.data.order);
    } catch (err) {
      console.error('Failed to fetch invoice:', err);
    }
  };

  const handlePay = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.post(
        `/invoices/${invoice.id}/pay`,
        { payment_method: invoice.payment_method },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Payment was made successfully ✅',
          text: 'Thank you!',
        });

      
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchInvoiceAndOrder();
      }
    } catch (err) {
      console.error('Payment failed:', err.response?.data || err.message);
      Swal.fire({
        icon: 'error',
        title: 'Payment failed❌',
        text: 'try again',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!invoice || !order) {
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

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-[#ffecb3] mb-6">
        <p className="mb-4 font-semibold text-lg">
          <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-[#6d4c41]" />
          Amount: <span className="text-[#388e3c]">{invoice.amount} EGP</span>
        </p>

        <p className="mb-4 font-semibold text-lg capitalize">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-[#6d4c41]" />
          Payment Method: {invoice.payment_method}
        </p>

        <p className={`mb-4 font-semibold text-lg flex items-center gap-2 ${getStatusColor(invoice.status)}`}>
          <FontAwesomeIcon icon={faClock} className="text-[#6d4c41]" />
          Status: {invoice.status}
        </p>

        <p className="text-sm text-gray-600 mt-4">
          Created at: {new Date(invoice.created_at).toLocaleString()}
        </p>
      </div>

      {/* ✅ Order Details */}
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-[#ffe0b2]">
        <h2 className="text-xl font-bold mb-4 text-[#6d4c41]">
          <FontAwesomeIcon icon={faUtensils} className="mr-2" />
          Order Details
        </h2>

        <p className="mb-2 capitalize">
          <strong>Type:</strong> {order.order_type}
        </p>

        {order.items && (
          <div className="mb-2">
            <strong>Items:</strong>
            <ul className="list-disc list-inside text-sm mt-1">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} — {item.pivot.quantity} x {item.pivot.price} EGP
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.dining_table && (
          <p className="mb-2">
            <FontAwesomeIcon icon={faChair} className="mr-2" />
            Table: {order.dining_table.name}
          </p>
        )}

        {order.order_type === 'delivery' && (
          <>
            <p className="mb-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Address: {order.delivery_address}
            </p>
            <p className="mb-2">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Phone: {order.phone}
            </p>
          </>
        )}

        <p className="mt-4 font-semibold text-[#4e342e]">
          <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
          Total: {order.total_price} EGP
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-10 print:hidden flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#ff7043] text-white px-6 py-2 rounded-lg shadow hover:bg-[#f4511e] transition flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        {invoice.status === 'unpaid' && invoice.payment_method !== 'cash' && (
          <button
            onClick={handlePay}
            className={`px-6 py-2 rounded-lg shadow text-white flex items-center gap-2 transition ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : '💳 Pay Invoice'}
          </button>
        )}

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
