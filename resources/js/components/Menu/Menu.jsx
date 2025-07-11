import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderType, setOrderType] = useState('dine_in');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();

    const returnedItem = location.state?.selectedItem;
    const returnedQuantity = location.state?.quantity;
    const returnedOrderType = location.state?.orderType;

    if (returnedItem) {
      setSelectedItem(returnedItem);
      setQuantity(returnedQuantity || 1);
      setOrderType(returnedOrderType || 'dine_in');
      setShowModal(true);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        axios.get('items'),
        axios.get('categories'),
      ]);
      setItems(itemsRes.data.data);
      setCategories(catsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    const user_id = userData?.id;

    if (!user_id) {
      Swal.fire('Error', 'User not logged in', 'error');
      return;
    }

    if (orderType === 'dine_in') {
      setShowModal(false);
      navigate('/user/reservations', {
        state: {
          selectedItem,
          quantity,
          orderType,
        },
      });
      return;
    }

    if (orderType === 'delivery') {
      if (!address || !phone) {
        Swal.fire('Missing Info', 'Please enter address and phone number.', 'warning');
        return;
      }
      if (!/^\d{11}$/.test(phone)) {
        Swal.fire('Invalid Phone', 'Phone number must be 11 digits.', 'error');
        return;
      }
    }

    try {
      const orderRes = await axios.post(
  'orders',
  {
    user_id,
    order_type: orderType,
    dining_table_id: null, 
    delivery_address: orderType === 'delivery' ? address : null,
    phone: orderType === 'delivery' ? phone : null,
    payment_method: paymentMethod,
    items: [{ id: selectedItem.id, quantity }],
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const newOrder = orderRes.data.data; // بيفترض إن ال API بيرجع order جديد في response

// ✅ إنشاء الفاتورة تلقائيًا
await axios.post(
  'invoices',
  {
    order_id: newOrder.id,
    amount: selectedItem.price * quantity,
    payment_method: paymentMethod, 

    status: 'unpaid',
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setShowModal(false);
      Swal.fire('Success', 'Order placed successfully!', 'success');
      navigate('/my-orders');
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message);
      Swal.fire('Error', 'Order could not be placed.', 'error');
    }
  };

  const filteredItems = selectedCategoryId
    ? items.filter((item) => item.category.id === selectedCategoryId)
    : items;

  return (
    <div className="min-h-screen bg-[#fefae0] px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-[#6d4c41] mt-20 mb-8">📋 Menu</h1>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full border ${
            selectedCategoryId === null
              ? 'bg-[#8b4513] text-white'
              : 'bg-white text-[#8b4513] border-[#8b4513]'
          } transition duration-300`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategoryId === cat.id
                ? 'bg-[#8b4513] text-white'
                : 'bg-white text-[#8b4513] border-[#8b4513]'
            } transition duration-300`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white w-full rounded-2xl p-5 shadow hover:shadow-xl transition duration-300 text-center border border-[#f0e6d2]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-[#6d4c41] mb-3">{item.name}</h3>
              <p className="text-[#8b4513] font-semibold text-lg mb-4">
                💰 {item.price} EGP
              </p>

              <button
                onClick={() => {
                  setSelectedItem(item);
                  setQuantity(1);
                  setShowModal(true);
                }}
                className="text-sm text-white bg-[#8b4513] px-4 py-2 rounded-xl hover:bg-[#a76e3c] transition"
              >
                Order Now
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No items available.</p>
      )}

      {/* ✅ Modal */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-xl z-50 w-full max-w-md border border-gray-300"
          >
            <h2 className="text-xl font-bold mb-4">Confirm Order</h2>

            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="dine_in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>

            <div className="mb-3">
  <label className="block mb-1 text-sm font-semibold">💳 Payment Method:</label>
  <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="cash">Cash</option>
    <option value="card">Card</option>
    <option value="online">Online</option>
  </select>
</div>

            {orderType === 'delivery' && (
              <div>
                <input
                  type="text"
                  placeholder="📍 Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="📞 Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
              </div>
            )}

            <div className="mb-2">
              <label className="block text-sm mb-1">🔢 Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4 text-right font-semibold text-[#5d4037]">
              Total: 💰 {selectedItem.price * quantity} EGP
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}