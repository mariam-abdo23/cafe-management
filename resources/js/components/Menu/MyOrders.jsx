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

export default function MyOrders() {
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
      console.error('Failed to fetch orders:', err);
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
      title: 'Are you sure?',
      text: 'This order will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
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
        Swal.fire('Deleted!', 'Order has been deleted.', 'success');
      } catch (err) {
        console.error('Failed to delete order:', err);
        Swal.fire('Error', 'Failed to delete order.', 'error');
      }
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

// ✅ المطلوب
// تعديل الـ handleEditSubmit علشان ميطلبش phone و address لو مش دليفري

const handleEditSubmit = async () => {
  const phoneValid = /^\d{11}$/.test(editOrder.phone || '');

  // ✅ التحقق من الدليفري فقط
  if (editOrder.order_type === 'delivery') {
    if (!editOrder.delivery_address || !editOrder.phone) {
      return Swal.fire('Missing Fields', 'Address and phone are required for delivery.', 'warning');
    }
    if (!phoneValid) {
      return Swal.fire('Invalid Phone', 'Phone number must be 11 digits.', 'error');
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

    // ✅ إرسال phone و address فقط لو order_type === delivery
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
    Swal.fire('Success', 'Order updated successfully.', 'success');

    if (editOrder.order_type === 'dine_in') {
      Swal.fire({
        title: 'Redirecting...',
        text: 'Now going to reserve a table for your order.',
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
    console.error('Failed to update order:', err);
    Swal.fire('Error', 'Failed to update order.', 'error');
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
        My Orders
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate('/menu')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all font-semibold flex items-center gap-2"
        >
          ➕ Create New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-8">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-[#fff8ec] border border-amber-200 rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="dine_in">Dine In</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#fff8ec] border border-amber-200 rounded-lg"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
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
                Order Type: <span className="capitalize">{order.order_type}</span>
              </span>
              <span className={`font-semibold ${getStatusColor(order.status)}`}>
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {order.status}
              </span>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold text-[#5d4037] mb-1">🛒 Items:</h4>
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
                Table: {order.dining_table.name}
              </p>
            )}

            {order.order_type === 'delivery' && (
              <>
                <p className="mb-1 text-sm text-[#5d4037]">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Address: {order.delivery_address}
                </p>
                <p className="mb-1 text-sm text-[#5d4037]">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  Phone: {order.phone}
                </p>
              </>
            )}

            <p className="text-sm mt-2 text-[#5d4037]">
              <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
              Payment: {order.payment_method || 'N/A'}
            </p>

            <p className="mt-2 font-semibold text-[#4e342e]">
              <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
              Total: {order.total_price} EGP
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => handleEdit(order)} className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-800">
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={() => navigate(`/invoices/order/${order.id}`)} className="text-green-700 hover:text-green-900">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-1" />
                Invoice
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Edit Modal */}
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
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-2 text-[#5d4037]">
                Edit Order #{editOrder.id}
              </h2>

              <select
                className="w-full p-2 border rounded mb-3"
                value={editOrder.order_type}
                onChange={(e) => setEditOrder({ ...editOrder, order_type: e.target.value })}
              >
                <option value="dine_in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>

              <select
                className="w-full p-2 border rounded mb-3"
                value={editOrder.payment_method || ''}
                onChange={(e) => setEditOrder({ ...editOrder, payment_method: e.target.value })}
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
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
                    placeholder="Delivery Address"
                    value={editOrder.delivery_address || ''}
                    onChange={(e) => setEditOrder({ ...editOrder, delivery_address: e.target.value })}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Phone Number"
                    value={editOrder.phone || ''}
                    onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
                  />
                </>
              )}

              <div className="mb-4 font-semibold text-[#4e342e]">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                Total: {editOrder.total_price} EGP
              </div>

              <button
                onClick={handleEditSubmit}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
