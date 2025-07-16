import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../Context/AuthContext';
import Swal from 'sweetalert2';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = ['Email is required'];
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = ['Email is not valid'];
    }

    if (!formData.password.trim()) {
      newErrors.password = ['Password is required'];
    } else if (formData.password.length < 6) {
      newErrors.password = ['Password must be at least 6 characters'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post('user/login', formData);
      const { token, user } = res.data.data;

      login(token, user.role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('token', token);

      Swal.fire('Success', 'You have been logged in successfully✅', 'success');

      setFormData({ email: '', password: '' });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const resErrors = err.response?.data;

      if (resErrors?.errors) {
        setErrors(resErrors.errors);
      } else if (resErrors?.message) {
        if (resErrors.message.includes('credentials')) {
          const message = '⚠ Incorrect email or password';
          setGeneralError(message);
          setErrors({ password: [message] }); 
        } else {
          setGeneralError('⚠ ' + resErrors.message);
        }
      } else {
        setGeneralError('❌ An error occurred while trying to log in.');
      }
    }
  };

  return <>
    <div className="min-h-screen bg-[#f5f5dc] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md sm:px-8 mt-24 border border-amber-100">
        <h2 className="text-3xl font-bold text-center text-[#8b4513] mb-6">
          ☕ Welcome Back!
        </h2>

        {generalError && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-xl text-center font-medium shadow">
            {generalError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
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
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
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

          <button
            type="submit"
            className="w-full bg-[#8b4513] text-white font-semibold py-2 rounded-xl hover:bg-amber-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-amber-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </>
}
