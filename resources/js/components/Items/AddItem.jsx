import React, { useState, useEffect } from 'react'; 
import axios from '../../api/axios';
import { motion } from 'framer-motion'; 
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faTrash, 
  faPenToSquare, 
  faUtensils, 
  faCheck, 
  faXmark, 
  faSearch, 
  faChevronDown, 
  faChevronUp, 
  faEye, } 
  from '@fortawesome/free-solid-svg-icons';

export default function AddItem() {

   const [name, setName] = useState(''); 
   const [description, setDescription] = useState(''); 
   const [price, setPrice] = useState(''); const [available, setAvailable] = useState(true); 
   const [category_id, setCategoryId] = useState('');
   const navigate = useNavigate();


  const [items, setItems] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true); const [openCategoryId, setOpenCategoryId] = useState(null); 
  const [editingItemId, setEditingItemId] = useState(null); 
  const [editFormData, setEditFormData] = useState({ name: '', description: '', price: '' }); 
  const [search, setSearch] = useState(''); const [sortOption, setSortOption] = useState('');

useEffect(() => { fetchCategories(); fetchItems(); }, []);

  const fetchCategories = async () => { try { 
  const res = await axios.get('/categories'); 
  
  setCategories(res.data.data); } catch (err) 
  { console.error('Failed to fetch categories:', err);
   }
   };

const fetchItems = async () => {
  
  try { 
    
    const res = await axios.get('/items'); 
    
    setItems(res.data.data); setLoading(false); } 
    
    catch (err) { console.error('Failed to fetch items:', err); 

    } };

const handleSubmit = async (e) => { e.preventDefault();

if (name.trim().length < 3 || parseFloat(price) <= 0 || !category_id) {
  Swal.fire('Validation Error', 'Please enter valid values.', 'warning');
  return;
}

try {
  if (editingItemId) {
    await axios.put(`/items/${editingItemId}`, {
      name,
      description,
      price: parseFloat(price),
      available,
      category_id,
    });
    Swal.fire('Updated!', 'Item has been updated successfully.', 'success');
  } else {
    await axios.post('/items', {
      name,
      description,
      price: parseFloat(price),
      available,
      category_id,
    });
    Swal.fire('Added!', 'Item has been added successfully.', 'success');
  }

  setName('');
  setDescription('');
  setPrice('');
  setAvailable(true);
  setCategoryId('');
  setEditingItemId(null);
  fetchItems();
} catch (err) {
  console.error('Failed to save item:', err);
  Swal.fire('Error!', 'Something went wrong while saving the item.', 'error');
}

};

const handleDelete = async (id) => { 
  
  const result = await 
  Swal.fire({ title: 'Are you sure?', 
    text: 'This item will be deleted permanently.', 
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#aaa', confirmButtonText: 'Yes, delete it!', });

if (result.isConfirmed) {
  try {
    await axios.delete(`/items/${id}`);
    fetchItems();
    Swal.fire('Deleted!', 'Item has been deleted.', 'success');
  } catch (err) {
    console.error('Failed to delete item:', err);
    Swal.fire('Error!', 'Could not delete the item.', 'error');
  }
}

};

const handleEditStart = (item) => { 
  setEditingItemId(item.id); 
  setName(item.name); 
  setDescription(item.description); 
  setPrice(item.price); 
  setAvailable(item.available); 
  setCategoryId(item.category.id); 
  window.scrollTo({ top: 0, behavior: 'smooth' }); };

  
  const handleShow = (item) => {
  navigate(`/items/${item.id}`);
}; 

const filteredItems = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) );

const sortedItems = [...filteredItems].sort((a, b) => { 
  if (sortOption === 'name-asc') return a.name.localeCompare(b.name); 
  if (sortOption === 'name-desc') return b.name.localeCompare(a.name); 
  if (sortOption === 'price-asc') return a.price - b.price; 
  if (sortOption === 'price-desc') return b.price - a.price; return 0; });

return <><div className="min-h-screen bg-[#f5f5dc] px-4 py-10"> 

<h2 className="text-3xl font-bold text-center text-[#6d4c41] mt-20 mb-6"> 
  <FontAwesomeIcon icon={faUtensils} className="mr-2 text-[#8b4513]" /> Manage Items </h2>

<div className="max-w-md mx-auto mb-4">
    <div className="flex items-center border rounded-xl overflow-hidden mb-3">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 focus:outline-none"
      />
      <span className="px-3 text-gray-500">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>

    <select
      onChange={(e) => setSortOption(e.target.value)}
      className="w-full border px-4 py-2 rounded-xl border-gray-300"
    >
      <option value="">Sort By</option>
      <option value="name-asc">Name (A-Z)</option>
      <option value="name-desc">Name (Z-A)</option>
      <option value="price-asc">Price (Low to High)</option>
      <option value="price-desc">Price (High to Low)</option>
    </select>
  </div>

  <div className="max-w-5xl mx-auto mb-10">
    {loading ? (
      <p className="text-center text-sm text-gray-500">⏳ Loading...</p>
    ) : (
      categories.map((cat) => {
        const catItems = sortedItems.filter((item) => item.category.id === cat.id);
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h3
              className="flex items-center justify-between text-lg font-semibold text-[#8b4513] mb-3 border-b pb-1 cursor-pointer hover:text-amber-600"
              onClick={() => setOpenCategoryId(openCategoryId === cat.id ? null : cat.id)}
            >
              {cat.name} ({catItems.length})
              <FontAwesomeIcon
                icon={openCategoryId === cat.id ? faChevronUp : faChevronDown}
                className="ml-2"
              />
            </h3>

            {openCategoryId === cat.id && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {catItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-[#fff4e6] p-4 rounded-xl shadow flex flex-col gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-medium cursor-pointer hover:underline text-[#5d4037]">
                      {item.name}
                    </span>
                    <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                    <p className="text-sm text-gray-700">💰 {item.price} EGP</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <button
                        onClick={() => handleEditStart(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => handleShow(item)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })
    )}
  </div>


<div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mx-auto border border-amber-100">
  <h2 className="text-2xl font-bold text-center text-[#8b4513] mb-6">
    {editingItemId ? '✏ Edit Item' : '➕ Add New Item'}
  </h2>

  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm text-gray-700 mb-1">Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl border-gray-300"
        required
      />
      {name.trim().length < 3 && (
        <p className="text-xs text-red-500 mt-1">Name must be at least 3 characters</p>
      )}
    </div>

    <div>
      <label className="block text-sm text-gray-700 mb-1">Description (optional)</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl border-gray-300"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-700 mb-1">Price</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl border-gray-300"
        required
      />
      {price !== '' && parseFloat(price) <= 0 && (
        <p className="text-xs text-red-500 mt-1">Price must be more than 0</p>
      )}
    </div>

    <div>
      <label className="block text-sm text-gray-700 mb-1">Category</label>
      <select
        value={category_id}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full border px-4 py-2 rounded-xl border-gray-300"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {!category_id && (
        <p className="text-xs text-red-500 mt-1">Please select a category</p>
      )}
    </div>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={available}
        onChange={(e) => setAvailable(e.target.checked)}
        id="available"
      />
      <label htmlFor="available" className="text-sm text-gray-700">
        Available
      </label>
    </div>

    <button
      type="submit"
      className="w-full bg-[#8b4513] text-white font-semibold py-2 rounded-xl hover:bg-amber-600 transition"
    >
      {editingItemId ? 'Update Item' : 'Add Item'}
    </button>
  </form>
</div>
</div>

</>
  }