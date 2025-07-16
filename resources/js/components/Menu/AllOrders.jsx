import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faClock,
  faMapMarkerAlt,
  faPhone,
  faChair,
  faUtensils,
  faMoneyBill,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function AllOrders() {
  const { t } = useTranslation('all_orders');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire('✅', t('all_orders.update_success'), 'success');
    } catch (error) {
      console.error('Failed to update status:', error);
      Swal.fire('❌', t('all_orders.update_error'), 'error');
    }
  };

  const handleDelete = async (orderId) => {
    const confirm = await Swal.fire({
      title: t('all_orders.delete_confirm_title'),
      text: t('all_orders.delete_confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('all_orders.delete_confirm_btn'),
      cancelButtonText: t('all_orders.delete_cancel_btn'),
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        Swal.fire('✅', t('all_orders.delete_success'), 'success');
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('❌', t('all_orders.delete_error'), 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'preparing':
        return 'text-blue-600';
      case 'ready':
        return 'text-green-600';
      case 'delivered':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbea] px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-[#5d4037] mb-10">
        {t('all_orders.title')}
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">{t('all_orders.no_orders')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-all"
            >
              <div className="mb-2 font-semibold">🆔 {t('all_orders.order_id')}: {order.id}</div>
              <div className="mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-600" />
                <strong>{t('all_orders.user')}:</strong> {order.user?.name || 'Unknown'}
              </div>
              <div className="mb-2">
                <FontAwesomeIcon icon={faUtensils} className="mr-2 text-gray-600" />
                <strong>{t('all_orders.type')}:</strong> {order.order_type}
              </div>

              {order.order_type === 'delivery' && (
                <>
                  <div className="mb-2">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-600" />
                    <strong>{t('all_orders.phone')}:</strong> {order.phone}
                  </div>
                  <div className="mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
                    <strong>{t('all_orders.address')}:</strong> {order.delivery_address}
                  </div>
                </>
              )}

              {order.dining_table && (
                <div className="mb-2">
                  <FontAwesomeIcon icon={faChair} className="mr-2 text-gray-600" />
                  <strong>{t('all_orders.table')}:</strong> {order.dining_table.name}
                </div>
              )}

              {order.reservation && (
                <div className="mb-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-600" />
                  <strong>{t('all_orders.reservation')}:</strong>{' '}
                  {new Date(order.reservation.reservation_time).toLocaleString()}
                </div>
              )}

              <div className="mb-2">
                <strong>{t('all_orders.status')}:</strong>{' '}
                <span className={`capitalize font-semibold ${getStatusColor(order.status)}`}>
                  {t(`all_orders.statuses.${order.status}`)}
                </span>
              </div>

              <div className="mb-2">
                <strong>{t('all_orders.change_status')}:</strong>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:ring focus:ring-amber-300"
                >
                  <option value="pending">{t('all_orders.statuses.pending')}</option>
                  <option value="preparing">{t('all_orders.statuses.preparing')}</option>
                  <option value="ready">{t('all_orders.statuses.ready')}</option>
                  <option value="delivered">{t('all_orders.statuses.delivered')}</option>
                </select>
              </div>

              <div className="mb-3 font-semibold text-[#4e342e]">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-2 text-green-600" />
                {t('all_orders.total')}: {order.total_price} EGP
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-400">
                  {t('all_orders.created_at')}: {new Date(order.created_at).toLocaleString()}
                </div>

                <button
                  onClick={() => handleDelete(order.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm border border-red-300 px-2 py-1 rounded-md transition-all"
                  title={t('all_orders.delete')}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  {t('all_orders.delete')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

