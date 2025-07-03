import React, { useState, useEffect } from 'react'; 
import axios from '../../api/axios'; 
import { motion } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';

export default function Menu() { 
  
  const [items, setItems] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [orderType, setOrderType] = useState('dine_in'); 
  const navigate = useNavigate();

useEffect(() => { fetchData(); }, []);

const fetchData = async () => {
  
  try { const [itemsRes, catsRes] = await Promise.all([ axios.get('items'), 
    
    axios.get('categories'), ]); setItems(itemsRes.data.data); 
    setCategories(catsRes.data.data); } 
    
    catch (err) { console.error('❌ Failed to fetch data:', err); } finally { setLoading(false); } };

const handleOrder = async (item) => {
   try { const token = localStorage.getItem('token'); 
    const user_id = localStorage.getItem('user_id'); // Adjust this depending on your auth system

await axios.post(
    'orders',
    {
      user_id: user_id,
      dining_table_id: orderType === 'dine_in' ? 1 : null, // Replace 1 with selected table if applicable
      items: [
        {
          id: item.id,
          quantity: 1
        }
      ],
      order_type: orderType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  alert('✅ تم الطلب بنجاح');
  navigate('/my-orders');
} catch (err) {
  console.error('❌ فشل الطلب', err);
  alert('فشل في تنفيذ الطلب');
}

};

const filteredItems = selectedCategoryId ? items.filter((item) => item.category.id === selectedCategoryId) : items;

return ( <div className="min-h-screen bg-[#fefae0] px-4 py-10"> <h1 className="text-3xl font-bold text-center text-[#6d4c41] mt-20 mb-8">📋 Our Menu</h1>

{/* 🔄 Order Type Selector */}
  <div className="flex justify-center mb-5">
    <select
      value={orderType}
      onChange={(e) => setOrderType(e.target.value)}
      className="p-2 border rounded bg-white text-[#6d4c41]"
    >
      <option value="dine_in">حجز ترابيزة</option>
      <option value="takeaway">استلام من المطعم</option>
      <option value="delivery">توصيل</option>
    </select>
  </div>

  {/* 🔶 Filters */}
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

  {/* 🔸 Items */}
  {loading ? (
    <p className="text-center text-sm text-gray-500">⏳ Loading...</p>
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
          <p className="text-[#8b4513] font-semibold text-lg mb-4">💰 {item.price} EGP</p>

          <button
            onClick={() => handleOrder(item)}
            className="text-sm text-white bg-[#8b4513] px-4 py-2 rounded-xl hover:bg-[#a76e3c] transition"
          >
            اطلب الآن
          </button>
        </motion.div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500">🚫 No items in this category.</p>
  )}
</div>

); }