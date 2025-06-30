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
  faCog
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ isOpen, closeSidebar, userRole }) {
  


  const commonLinks = [
    { to: '/', label: 'Home', icon: faHome },
    { to: '/menu', label: 'Menu', icon: faUtensils },
    { to: '/my-orders', label: 'My Orders', icon: faReceipt },
    { to: '/profile', label: 'Profile', icon: faUsers },
  ];

  const employeeLinks = [
    { to: '/orders', label: 'Manage Orders', icon: faReceipt },
    { to: '/inventory', label: 'Inventory', icon: faUtensils },
    { to: '/edit-item', label: 'Edit Item', icon: faUtensils },
  ];

  const adminLinks = [
    { to: '/users', label: 'Manage Users', icon: faUsers },
    { to: '/staff', label: 'Manage Staff', icon: faUsers },
    { to: '/items', label: 'Manage Items', icon: faUtensils },
    { to: '/reports', label: 'Reports', icon: faChartBar },
    { to: '/settings', label: 'Settings', icon: faCog },
  ];

  const getLinksByRole = () => {
    if (userRole === 'admin') return [...commonLinks, ...adminLinks];
    if (userRole === 'employee') return [...commonLinks, ...employeeLinks];
    if (userRole === 'user') return commonLinks;
    return [];
    
  };

  const renderLinks = (links) =>
    links.map(({ to, label, icon }) => (
      <li key={to}>
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
      </li>
    ));

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-[#d2b48c] shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <button onClick={closeSidebar} className="text-[#a5522b] text-2xl p-4">
        <FontAwesomeIcon className="cursor-pointer" icon={faCircleXmark} />
      </button>

      <ul className="p-4 space-y-4">
        {userRole && (
          <>
            <p className="text-sm font-semibold text-[#5d4037] mt-6 capitalize">
              {userRole} Panel
            </p>
            {renderLinks(getLinksByRole())}
          </>
        )}
      </ul>
      
    </div>
  );
}
