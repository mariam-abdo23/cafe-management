import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoiceAndOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          title: t('invoice.buttons.paySuccessTitle', 'Payment was made successfully ✅'),
          text: t('invoice.buttons.paySuccessText', 'Thank you!'),
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchInvoiceAndOrder();
      }
    } catch (err) {
      console.error('Payment failed:', err.response?.data || err.message);
      Swal.fire({
        icon: 'error',
        title: t('invoice.buttons.payFailedTitle', 'Payment failed❌'),
        text: t('invoice.buttons.payFailedText', 'Try again'),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!invoice || !order) {
    return <div className="text-center mt-10 text-[#6d4c41] font-semibold">{t('invoice.loading', 'Loading invoice...')}</div>;
  }

  const getStatusColor = (status) => {
    return status === 'paid' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen px-4 py-16 bg-[#fff8e1] text-[#4e342e]">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#6d4c41]">
        <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
        {t('invoice.title')}
      </h1>

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-[#ffecb3] mb-6">
        <p className="mb-4 font-semibold text-lg">
          <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-[#6d4c41]" />
          {t('invoice.amount')}: <span className="text-[#388e3c]">{invoice.amount} EGP</span>
        </p>

        <p className="mb-4 font-semibold text-lg capitalize">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-[#6d4c41]" />
          {t('invoice.paymentMethod')}: {t(`invoice.payment${invoice.payment_method.charAt(0).toUpperCase() + invoice.payment_method.slice(1)}`) || invoice.payment_method}
        </p>

        <p className={`mb-4 font-semibold text-lg flex items-center gap-2 ${getStatusColor(invoice.status)}`}>
          <FontAwesomeIcon icon={faClock} className="text-[#6d4c41]" />
          {t('invoice.status')}: {t(`invoice.status${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}`) || invoice.status}
        </p>

        <p className="text-sm text-gray-600 mt-4">
          {t('invoice.createdAt')}: {new Date(invoice.created_at).toLocaleString()}
        </p>
      </div>

      {/* Order Details */}
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-[#ffe0b2]">
        <h2 className="text-xl font-bold mb-4 text-[#6d4c41]">
          <FontAwesomeIcon icon={faUtensils} className="mr-2" />
          {t('invoice.orderDetails')}
        </h2>

        <p className="mb-2 capitalize">
          <strong>{t('invoice.type')}:</strong> {order.order_type}
        </p>

        {order.items && (
          <div className="mb-2">
            <strong>{t('invoice.items')}:</strong>
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
            {t('invoice.table')}: {order.dining_table.name}
          </p>
        )}

        {order.order_type === 'delivery' && (
          <>
            <p className="mb-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              {t('invoice.address')}: {order.delivery_address}
            </p>
            <p className="mb-2">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              {t('invoice.phone')}: {order.phone}
            </p>
          </>
        )}

        <p className="mt-4 font-semibold text-[#4e342e]">
          <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
          {t('invoice.total')}: {order.total_price} EGP
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-10 print:hidden flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#ff7043] text-white px-6 py-2 rounded-lg shadow hover:bg-[#f4511e] transition flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t('invoice.buttons.back')}
        </button>

        {invoice.status === 'unpaid' && invoice.payment_method !== 'cash' && (
          <button
            onClick={handlePay}
            className={`px-6 py-2 rounded-lg shadow text-white flex items-center gap-2 transition ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? t('invoice.buttons.processing') : t('invoice.buttons.payInvoice')}
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
        >
          {t('invoice.buttons.printInvoice')}
        </button>
      </div>
    </div>
  );
}
