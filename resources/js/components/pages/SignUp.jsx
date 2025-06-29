import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role_id: '',
  });

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('user/roles')
      .then((res) => {
        setRoles(res.data);
      })
      .catch(() => {
        setRoles([]);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setGeneralError('');

    try {
      await axios.post('user/signup', formData);
      setSuccessMessage('✅ Registration completed successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role_id: '',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError('❌ There was a problem during registration.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md sm:px-8 mt-24 border border-amber-100">
        <h2 className="text-3xl font-bold text-center text-[#8b4513] mb-6">
          ☕ Create Your Account
        </h2>

       
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-xl text-center font-medium shadow">
            {successMessage}
          </div>
        )}

        
        {generalError && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-xl text-center font-medium shadow">
            {generalError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
         
          <div>
            <label className="block mb-1 text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <div className="min-h-[20px] mt-1">
              {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
            </div>
          </div>

         
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@coffee.com"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <div className="min-h-[20px] mt-1">
              {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
            </div>
          </div>

          
          <div>
            <label className="block mb-1 text-sm text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.phone ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <div className="min-h-[20px] mt-1">
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
            </div>
          </div>

          
          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <div className="min-h-[20px] mt-1">
              {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
            </div>
          </div>

          
          <div>
            <label className="block mb-1 text-sm text-gray-700">Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.role_id ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a role</option>
              {Array.isArray(roles) &&
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
            </select>
            <div className="min-h-[20px] mt-1">
              {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id[0]}</p>}
            </div>
          </div>

          
          <button
            type="submit"
            className="w-full bg-[#8b4513] text-white font-semibold py-2 rounded-xl hover:bg-amber-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
