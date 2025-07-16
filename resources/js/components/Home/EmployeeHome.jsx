import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmployeeHome() {
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setEmployeeName(user.name);
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

  const sections = [
    <motion.div
      key="banner"
      custom={1}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-[#6b4226] text-white text-center py-10 px-6 rounded-2xl shadow-lg max-w-4xl mx-auto mb-8"
    >
      <h1 className="text-4xl font-bold mb-2">Welcome, {employeeName || 'Our Valued Employee'} 👋</h1>
      <p className="text-lg">We’re glad to have you on board. Let’s make today productive! 💼</p>
    </motion.div>,

    <motion.p
      key="intro"
      custom={2}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-[#795548] mt-20 text-lg mb-6 text-center"
    >
      Start your tasks from here 👇
    </motion.p>,

    <motion.div
      key="grid"
      custom={3}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      {[{
        to: '/add-category', label: 'Manage Categories 🍕', bg: 'bg-[#8d6e63]', hover: 'hover:bg-[#6d4c41]'
      }, {
        to: '/add-item', label: 'Add Item 🧾', bg: 'bg-[#a1887f]', hover: 'hover:bg-[#7b5e57]'
      }, {
        to: '/AllOrders', label: 'Orders 🔄', bg: 'bg-[#bcaaa4]', hover: 'hover:bg-[#8d6e63]'
      }, {
        to: '/admin-tables', label: 'Tables 🪑', bg: 'bg-[#a9746e]', hover: 'hover:bg-[#874843]'
      }, {
        to: '/invoices', label: 'Invoices 💸', bg: 'bg-[#c18f80]', hover: 'hover:bg-[#a16758]'
      }, {
        to: '/Staff-Profile', label: 'Profile 👤', bg: 'bg-[#9e6f60]', hover: 'hover:bg-[#7b4a3d]'
      }].map(({ to, label, bg, hover }, i) => (
        <Link
          key={i}
          to={to}
          className={`${bg} ${hover} p-4 rounded-xl shadow-md text-white font-semibold text-center transition`}
        >
          {label}
        </Link>
      ))}
    </motion.div>,

    <motion.div
      key="reminder"
      custom={4}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-20 text-center text-[#6b4226] text-xl"
    >
      <p>Remember to check daily tasks and keep the workspace organized ☕</p>
      <p className="mt-4">We're happy to have you on the team! 🚀</p>
    </motion.div>,
  ];

  return (
    <div className="p-6 bg-[#fdf6e3] min-h-screen pb-40">
      {sections.map((section, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {section}
        </motion.div>
      ))}
    </div>
    
  );
}
