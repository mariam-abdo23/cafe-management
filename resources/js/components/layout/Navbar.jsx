import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // مؤقتًا نحدد الدور (ممكن تيجي لاحقًا من تسجيل الدخول)
  const userRole = 'admin'; // أو employee / user

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
