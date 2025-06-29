import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../Context/AuthContext'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('user/logout');
    } catch (err) {
      console.error('Error while logging out:', err);
    }
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const userRole = 'admin'; 

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#8b4513] p-4 shadow-lg z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => setIsOpen(true)} className="text-2xl">
            <FontAwesomeIcon
              className="text-white cursor-pointer hover:text-amber-400 transform transition-transform duration-300 hover:scale-110"
              icon={faBarsStaggered}
            />
          </button>

          <div className="flex gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="bg-white text-[#8b4513] font-semibold px-4 py-2 rounded-xl shadow hover:bg-amber-100 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-white hover:text-[#8b4513] transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <Sidebar
        isOpen={isOpen}
        closeSidebar={() => setIsOpen(false)}
        userRole={userRole}
      />
    </>
  );
}
