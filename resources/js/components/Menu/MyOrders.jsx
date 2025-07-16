import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChair,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faMoneyBill,
  faUtensils,
  faBoxOpen,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
    


export default function MyOrders() {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, typeFilter, statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error(t('myOrders.error.fetchFailed'), err);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    if (typeFilter !== 'all') {
      filtered = filtered.filter((order) => order.order_type === typeFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'preparing':
        return 'text-blue-600';
      case 'ready':
        return 'text-purple-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleEdit = (order) => {
    const itemsCopy = order.items.map((item) => ({ ...item }));
    const total = calculateTotal(itemsCopy);
    setEditOrder({ ...order, items: itemsCopy, total_price: total });
  };

  const handleDelete = async (orderId) => {
    const confirm = await Swal.fire({
      title: t('myOrders.deleteConfirmTitle'),
      text: t('myOrders.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('myOrders.deleteConfirmYes'),
      cancelButtonText: t('myOrders.deleteConfirmCancel'),
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchOrders();
        Swal.fire(t('myOrders.deletedTitle'), t('myOrders.deletedText'), 'success');
      } catch (err) {
        console.error(t('myOrders.error.deleteFailed'), err);
        Swal.fire(t('myOrders.errorTitle'), t('myOrders.error.deleteFailed'), 'error');
      }
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const handleEditSubmit = async () => {
    const phoneValid = /^\d{11}$/.test(editOrder.phone || '');

    if (editOrder.order_type === 'delivery') {
      if (!editOrder.delivery_address || !editOrder.phone) {
        return Swal.fire(
          t('myOrders.warningTitle'),
          t('myOrders.error.missingAddressPhone'),
          'warning'
        );
      }
      if (!phoneValid) {
        return Swal.fire(t('myOrders.errorTitle'), t('myOrders.error.invalidPhone'), 'error');
      }
    }

    const updatedItems = editOrder.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        items: updatedItems,
        order_type: editOrder.order_type,
        payment_method: editOrder.payment_method,
      };

      if (editOrder.order_type === 'delivery') {
        updatedData.delivery_address = editOrder.delivery_address;
        updatedData.phone = editOrder.phone;
      }

      await axios.put(`/orders/${editOrder.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditOrder(null);
      fetchOrders();
      Swal.fire(t('myOrders.successTitle'), t('myOrders.successUpdate'), 'success');

      if (editOrder.order_type === 'dine_in') {
        Swal.fire({
          title: t('myOrders.redirectingTitle'),
          text: t('myOrders.redirectingText'),
          icon: 'info',
          timer: 1500,
          showConfirmButton: false,
        });

        navigate('/user/reservations', {
          state: {
            selectedItem: editOrder.items[0],
            quantity: editOrder.items[0].quantity || 1,
            orderType: 'dine_in',
          },
        });

        return;
      }
    } catch (err) {
      console.error(t('myOrders.error.updateFailed'), err);
      Swal.fire(t('myOrders.errorTitle'), t('myOrders.error.updateFailed'), 'error');
    }
  };

  const handleItemChange = (index, value) => {
    const updatedItems = [...editOrder.items];
    updatedItems[index].quantity = parseInt(value);
    const newTotal = calculateTotal(updatedItems);
    setEditOrder({ ...editOrder, items: updatedItems, total_price: newTotal });
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] px-4 py-10 relative z-10">
      <h1 className="text-3xl font-bold text-center text-[#6d4c41] mt-20 mb-6">
        <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
        {t('myOrders.title')}
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate('/menu')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all font-semibold flex items-center gap-2"
        >
          ➕ {t('myOrders.createNewOrder')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-8">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-[#fff8ec] border border-amber-200 rounded-lg"
        >
          <option value="all">{t('myOrders.filter.allTypes')}</option>
          <option value="dine_in">{t('myOrders.filter.dineIn')}</option>
          <option value="takeaway">{t('myOrders.filter.takeaway')}</option>
          <option value="delivery">{t('myOrders.filter.delivery')}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#fff8ec] border border-amber-200 rounded-lg"
        >
          <option value="all">{t('myOrders.filter.allStatuses')}</option>
          <option value="pending">{t('myOrders.filter.pending')}</option>
          <option value="preparing">{t('myOrders.filter.preparing')}</option>
          <option value="ready">{t('myOrders.filter.ready')}</option>
          <option value="delivered">{t('myOrders.filter.delivered')}</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow-md border border-amber-100 hover:bg-amber-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#5d4037]">
                <FontAwesomeIcon icon={faUtensils} className="mr-2" />
                {t('myOrders.orderTypeLabel')}: <span className="capitalize">{t(`myOrders.orderType.${order.order_type}`)}</span>
              </span>
              <span className={`font-semibold ${getStatusColor(order.status)}`}>
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {t(`myOrders.status.${order.status}`)}
              </span>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold text-[#5d4037] mb-1">🛒 {t('myOrders.itemsLabel')}:</h4>
              <ul className="list-disc list-inside space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} x {item.price} EGP
                  </li>
                ))}
              </ul>
            </div>

            {order.dining_table && (
              <p className="mb-1 text-sm text-[#5d4037]">
                <FontAwesomeIcon icon={faChair} className="mr-2" />
                {t('myOrders.tableLabel')}: {order.dining_table.name}
              </p>
            )}

            {order.order_type === 'delivery' && (
              <>
                <p className="mb-1 text-sm text-[#5d4037]">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {t('myOrders.addressLabel')}: {order.delivery_address}
                </p>
                <p className="mb-1 text-sm text-[#5d4037]">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  {t('myOrders.phoneLabel')}: {order.phone}
                </p>
              </>
            )}

            <p className="text-sm mt-2 text-[#5d4037]">
              <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
              {t('myOrders.paymentLabel')}: {order.payment_method || t('myOrders.notAvailable')}
            </p>

            <p className="mt-2 font-semibold text-[#4e342e]">
              <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
              {t('myOrders.totalLabel')}: {order.total_price} EGP
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => handleEdit(order)} className="text-blue-600 hover:text-blue-800" aria-label={t('myOrders.edit')}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-800" aria-label={t('myOrders.delete')}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                onClick={() => navigate(`/invoices/order/${order.id}`)}
                className="text-green-700 hover:text-green-900"
                aria-label={t('myOrders.invoice')}
              >
                <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
                {t('myOrders.invoice')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative"
            >
              <button
                onClick={() => setEditOrder(null)}
                className="absolute top-2 right-3 text-red-600 text-2xl font-bold hover:text-red-800"
                aria-label={t('myOrders.close')}
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-2 text-[#5d4037]">
                {t('myOrders.editOrderTitle', { id: editOrder.id })}
              </h2>

              <select
                className="w-full p-2 border rounded mb-3"
                value={editOrder.order_type}
                onChange={(e) => setEditOrder({ ...editOrder, order_type: e.target.value })}
              >
                <option value="dine_in">{t('myOrders.orderType.dine_in')}</option>
                <option value="takeaway">{t('myOrders.orderType.takeaway')}</option>
                <option value="delivery">{t('myOrders.orderType.delivery')}</option>
              </select>

              <select
                className="w-full p-2 border rounded mb-3"
                value={editOrder.payment_method || ''}
                onChange={(e) => setEditOrder({ ...editOrder, payment_method: e.target.value })}
              >
                <option value="">{t('myOrders.selectPaymentMethod')}</option>
                <option value="cash">{t('myOrders.payment.cash')}</option>
                <option value="card">{t('myOrders.payment.card')}</option>
              </select>

              {editOrder.items.map((item, index) => (
                <div key={item.id} className="mb-4">
                  <label className="block font-semibold">{item.name}</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full p-2 border rounded"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                  />
                </div>
              ))}

              {editOrder.order_type === 'delivery' && (
                <>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder={t('myOrders.deliveryAddressPlaceholder')}
                    value={editOrder.delivery_address || ''}
                    onChange={(e) => setEditOrder({ ...editOrder, delivery_address: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    placeholder={t('myOrders.phonePlaceholder')}
                    value={editOrder.phone || ''}
                    onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
                  />
                </>
              )}

              <div className="mb-4 font-semibold text-[#4e342e]">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                {t('myOrders.totalLabel')}: {editOrder.total_price} EGP
              </div>

              <button
                onClick={handleEditSubmit}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('myOrders.saveChanges')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
