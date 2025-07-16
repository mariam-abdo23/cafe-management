import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminHome() {
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAdminName(user.name);
    }
  }, []);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  return (
    

    <div className="p-6 bg-[#fdf6e3] min-h-screen pb-40">
      {/* Welcome Banner */}
      <motion.div
        custom={1}
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#4b3621] text-white text-center py-10 px-6 rounded-2xl shadow-lg max-w-4xl mx-auto mb-8"
      >
        <h1 className="text-4xl font-bold  mb-2">Welcome, {adminName || 'Admin'} 👋</h1>
        <p className="text-lg">Manage all your café operations from here with ease and confidence. ☕🛠️</p>
      </motion.div>

      {/* Introduction Text */}
      <motion.p
        custom={2}
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-[#5d4037] text-lg mb-6 text-center"
      >
        Use the tools below to get started with managing the café 👇
      </motion.p>

      {/* Admin Control Buttons */}
      <motion.div
        custom={3}
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {[
          { to: '/add-category', label: 'Category Management 🧾', bg: 'bg-[#8d6e63]', hover: 'hover:bg-[#5d4037]' },
          { to: '/add-item', label: 'Item Management 🍽️', bg: 'bg-[#a1887f]', hover: 'hover:bg-[#6d4c41]' },
          { to: '/admin-tables', label: 'Table Control 🪑', bg: 'bg-[#bcaaa4]', hover: 'hover:bg-[#8d6e63]' },
          { to: '/admin/reservations', label: 'Reservations 📅', bg: 'bg-[#a9746e]', hover: 'hover:bg-[#6d4c41]' },
          { to: '/AllOrders', label: 'Orders 🧾', bg: 'bg-[#c18f80]', hover: 'hover:bg-[#a16758]' },
          { to: '/invoices', label: 'Invoices 💵', bg: 'bg-[#9e6f60]', hover: 'hover:bg-[#7b4a3d]' },
          { to: '/AdminShifts', label: 'Shift Management ⏰', bg: 'bg-[#a1887f]', hover: 'hover:bg-[#6d4c41]' },
          { to: '/ManageStaff', label: 'Staff Management 👥', bg: 'bg-[#8d6e63]', hover: 'hover:bg-[#5d4037]' }
        ].map(({ to, label, bg, hover }, i) => (
          <Link
            key={i}
            to={to}
            className={`${bg} ${hover} p-4 rounded-xl shadow-md text-white font-semibold text-center transition`}
          >
            {label}
          </Link>
        ))}
      </motion.div>

      {/* Reminder Message */}
      <motion.div
        custom={4}
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 text-center text-[#4b3621] text-xl"
      >
        <p>Make sure to monitor system updates and staff activities regularly. 🔎</p>
        <p className="mt-4">Thanks for keeping operations smooth and customers happy! 💼🎉</p>
      </motion.div>
    </div>
  );
}
