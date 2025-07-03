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
  const commonLinks = [
    { to: '/', label: 'Home', icon: faHome },
    { to: '/menu', label: 'Menu', icon: faUtensils },
    { to: '/user/reservations', label: 'Reservations', icon: faListCheck }, //تم
    { to: '/my-orders', label: 'My Orders', icon: faListCheck },
    { to: '/Contact', label: 'Contact', icon: faPhone },
    { to: '/profile', label: 'Profile', icon: faUsers },
  ];

  const employeeLinks = [
    { to: '/add-category', label: 'Add Category', icon: faUtensils }, // تم
    { to: '/add-item', label: 'Add Item', icon: faUtensils }, // تم
    { to: '/admin-tables', label: 'Tables', icon: faTable }, // تم
    { to: '/admin/reservations', label: 'Reservations', icon: faListCheck },//تم
    
    { to: '/orders', label: 'Manage Orders', icon: faReceipt },
    { to: '/inventory', label: 'Inventory', icon: faUtensils },
    { to: '/shifts', label: 'Shifts', icon: faCalendarDays },
  
  ];

  const adminLinks = [
    { to: '/add-category', label: 'Add Category', icon: faUtensils }, // تم
    { to: '/add-item', label: 'Add Item', icon: faUtensils }, // تم
    { to: '/admin-tables', label: 'Tables', icon: faTable }, // نم
    { to: '/admin/reservations', label: 'Reservations', icon: faListCheck },//تم

    { to: '/users', label: 'Manage Users', icon: faUsers },
    { to: '/staff', label: 'Manage Staff', icon: faUsers },
    { to: '/invoices', label: 'Invoices', icon: faFileInvoiceDollar },
    { to: '/reports', label: 'Reports', icon: faChartBar },
    { to: '/settings', label: 'Settings', icon: faCog },
  ];

  const getLinksByRole = () => {
    if (userRole === 'admin') return [ ...adminLinks];
    if (userRole === 'employee') return [ ...employeeLinks];
    if (userRole === 'user') return commonLinks;
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
          transition={{ duration: 0.5, ease:easeOut }}
          className="fixed top-0 left-0 h-full w-64 bg-[#d2b48c] shadow-2xl z-50 p-4"
        >
          <button onClick={closeSidebar} className="text-[#a5522b] text-2xl mb-4">
            <FontAwesomeIcon className="cursor-pointer" icon={faCircleXmark} />
          </button>

          <ul className="space-y-4">
            {userRole ? (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.10 }}
                  className="text-sm font-semibold text-[#5d4037] capitalize"
                >
                  {userRole} Panel
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


