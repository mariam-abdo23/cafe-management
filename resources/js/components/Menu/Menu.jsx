import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

export default function Menu() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderType, setOrderType] = useState('dine_in');
  const [paymentMethod, setPaymentMethod] = useState('card');
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

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem('user'));
    } catch (err) {}

    const user_id = userData?.id;
    if (!user_id) {
      Swal.fire(t('menu.errorTitle') || 'Error', t('menu.error.userNotLoggedIn'), 'error');
      return;
    }

    if (orderType === 'dine_in') {
      setShowModal(false);
      navigate('/user/reservations', {
        state: { selectedItem, quantity, orderType },
      });
      return;
    }

    if (orderType === 'delivery') {
      if (!phone || !/^\d{11}$/.test(phone)) {
        Swal.fire(t('menu.errorTitle') || 'Error', t('menu.error.invalidPhone'), 'error');
        return;
      }
      if (!address) {
        Swal.fire(t('menu.warningTitle') || 'Warning', t('menu.error.missingAddress'), 'warning');
        return;
      }
    } else {
      setPhone('');
      setAddress('');
    }

    const orderPayload = {
      user_id,
      order_type: orderType,
      dining_table_id: null,
      payment_method: paymentMethod,
      items: [{ id: selectedItem.id, quantity }],
    };

    if (orderType === 'delivery') {
      orderPayload.delivery_address = address;
      orderPayload.phone = phone;
    }

    try {
      const orderRes = await axios.post('orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newOrder = orderRes.data.data;

      setShowModal(false);
      Swal.fire(t('menu.successTitle') || 'Success', t('menu.success'), 'success');
      navigate('/my-orders');
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message);
      Swal.fire(t('menu.errorTitle') || 'Error', t('menu.error.orderFailed'), 'error');
    }
  };

  const filteredItems = selectedCategoryId
    ? items.filter((item) => item.category.id === selectedCategoryId)
    : items;

  return (
    <div className="min-h-screen bg-[#fefae0] px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-[#6d4c41] mb-8">{t('menu.title')}</h1>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full border ${
            selectedCategoryId === null
              ? 'bg-[#8b4513] text-white'
              : 'bg-white text-[#8b4513] border-[#8b4513]'
          } transition duration-300`}
        >
          {t('menu.all')}
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
        <p className="text-center text-sm text-gray-500">{t('menu.loading')}</p>
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
                {t('menu.orderNow')}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">{t('menu.noItems')}</p>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl shadow-xl z-50 w-full max-w-md border border-gray-300 sm:p-4"
          >
            <h2 className="text-xl font-bold mb-4">{t('menu.confirmOrder')}</h2>

            <select
              value={orderType}
              onChange={(e) => {
                const type = e.target.value;
                setOrderType(type);
                if (type !== 'delivery') {
                  setPhone('');
                  setAddress('');
                }
              }}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="dine_in">{t('menu.orderType.dine_in')}</option>
              <option value="takeaway">{t('menu.orderType.takeaway')}</option>
              <option value="delivery">{t('menu.orderType.delivery')}</option>
            </select>

            <div className="mb-3">
              <label className="block mb-1 text-sm font-semibold">{t('menu.paymentMethod.label')}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="cash">{t('menu.paymentMethod.cash')}</option>
                <option value="card">{t('menu.paymentMethod.card')}</option>
                <option value="online">{t('menu.paymentMethod.online')}</option>
              </select>
            </div>

            {orderType === 'delivery' && (
              <div>
                <input
                  type="text"
                  placeholder={t('menu.addressPlaceholder')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder={t('menu.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
              </div>
            )}

            <div className="mb-2">
              <label className="block text-sm mb-1">{t('menu.quantityLabel')}</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4 text-right font-semibold text-[#5d4037]">
              {t('menu.totalLabel')} {(selectedItem.price * quantity).toFixed(2)} EGP
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                {t('menu.cancel')}
              </button>
              <button
                onClick={handleOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t('menu.confirm')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
