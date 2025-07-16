import React, { useState, useEffect } from 'react';
import axios from '../../api/axios'; // for signup (with token)
import rawAxios from 'axios'; // for public requests (without token)
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
  const [loadingRoles, setLoadingRoles] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    rawAxios
      .get('http://127.0.0.1:8000/api/user/roles')
      .then((res) => {
        const rolesList = Array.isArray(res.data)
          ? res.data
          : res.data?.data ?? [];
        setRoles(rolesList);
      })
      .catch((err) => {
        console.error('Failed to load roles:', err);
        Swal.fire('Error', 'Failed to load roles from the server', 'error');
      })
      .finally(() => setLoadingRoles(false));
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

    try {
      const dataToSend = {
        ...formData,
        role_id: formData.role_id || 1, // default to employee if not selected
      };

      await axios.post('user/signup', dataToSend);

      Swal.fire('Success', 'Your account has been created 🎉', 'success');
      setFormData({ name: '', email: '', phone: '', password: '', role_id: '' });
      setErrors({});

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        Swal.fire('Warning', 'Please check your input fields', 'warning');
      } else {
        Swal.fire('Error', 'An unexpected error occurred during signup', 'error');
      }
    }
  };

  return <>
    <div className="min-h-screen mb-3 bg-[#f5f5dc] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md sm:px-8 mt-24 border border-amber-100">
        <h2 className="text-3xl font-bold text-center text-[#8b4513] mb-6">
          ☕ Create Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
          </div>

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
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]{11}"
              title="Enter 11 digit phone number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01234567890"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.phone ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Role</label>
            {loadingRoles ? (
              <p className="text-sm text-gray-500">Loading roles...</p>
            ) : roles.length === 0 ? (
              <p className="text-sm text-red-600">No roles available</p>
            ) : (
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                  errors.role_id ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
            {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id[0]}</p>}
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
  </>
}
