import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faHome,
  faReceipt,
  faUtensils,
  faUsers,
  faChartBar,
  faCog,
  faCalendarDays,
  faListCheck,
  faFileInvoiceDollar,
  faPhone,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence, easeOut } from 'framer-motion';

export default function Sidebar({ isOpen, closeSidebar, userRole }) {
  const homeLink = { to: '/', label: 'Home', icon: faHome };

  const commonLinks = [
    { to: '/menu', label: 'Menu', icon: faUtensils },
    { to: '/user/reservations', label: 'Reservations', icon: faListCheck },
    { to: '/my-orders', label: 'My Orders', icon: faListCheck },
  ];

  const employeeLinks = [
    { to: '/add-category', label: 'Add Category', icon: faUtensils },
    { to: '/add-item', label: 'Add Item', icon: faUtensils },
    { to: '/admin-tables', label: 'Tables', icon: faTable },
    { to: '/admin/reservations', label: 'Reservations', icon: faListCheck },
    { to: '/AllOrders', label: 'Manage Orders', icon: faReceipt },
    { to: '/inventory', label: 'Inventory', icon: faUtensils },
    { to: '/invoices', label: 'Invoices', icon: faFileInvoiceDollar },
    { to: '/Staff-Profile', label: 'Staff Profile', icon: faCalendarDays },
  ];

  const adminLinks = [
    { to: '/add-category', label: 'Add Category', icon: faUtensils },
    { to: '/add-item', label: 'Add Item', icon: faUtensils },
    { to: '/admin-tables', label: 'Tables', icon: faTable },
    { to: '/admin/reservations', label: 'Reservations', icon: faListCheck },
    { to: '/AllOrders', label: 'Manage Orders', icon: faReceipt },
    { to: '/invoices', label: 'Invoices', icon: faFileInvoiceDollar },
    { to: '/AdminShifts', label: 'Manage Shifts', icon: faCalendarDays },
    { to: '/ManageStaff', label: 'Manage Staff', icon: faUsers },
  ];

  const getLinksByRole = () => {
    if (userRole === 'admin') return [homeLink, ...adminLinks];
    if (userRole === 'employee') return [homeLink, ...employeeLinks];
    if (userRole === 'user') return [homeLink, ...commonLinks];
    return [];
  };

  const renderLinks = (links) =>
    links.map(({ to, label, icon }, index) => (
      <motion.li
        key={to}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <NavLink
          to={to}
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-2 hover:text-[#7b5044] transition duration-200 ${
              isActive ? 'text-[#31211e] font-bold' : ''
            }`
          }
        >
          <FontAwesomeIcon icon={icon} /> {label}
        </NavLink>
      </motion.li>
    ));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="fixed top-0 left-0 h-full w-64 sm:w-72 bg-[#d2b48c] shadow-2xl z-50 p-4"
        >
          <button onClick={closeSidebar} className="text-[#a5522b] text-2xl mb-4">
            <FontAwesomeIcon
              className="cursor-pointer hover:text-red-600 transition duration-200"
              icon={faCircleXmark}
            />
          </button>

          <ul className="space-y-4">
            {userRole ? (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm font-semibold text-[#5d4037] capitalize"
                >
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel
                </motion.p>
                {renderLinks(getLinksByRole())}
              </>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-center text-red-700 font-semibold"
              >
                Please log in to access more features.
              </motion.p>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
