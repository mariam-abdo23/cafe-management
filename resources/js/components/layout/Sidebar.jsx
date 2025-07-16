import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faHome,
  faReceipt,
  faUtensils,
  faUsers,
  faCalendarDays,
  faListCheck,
  faFileInvoiceDollar,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Sidebar({ isOpen, closeSidebar, userRole }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const homeLink = { to: '/', label: t('navbar.home'), icon: faHome };

  const commonLinks = [
    { to: '/menu', label: t('navbar.menu'), icon: faUtensils },
    { to: '/user/reservations', label: t('navbar.reservations'), icon: faListCheck },
    { to: '/my-orders', label: t('navbar.myorders'), icon: faListCheck },
  ];

  const employeeLinks = [
    { to: '/add-category', label: t('navbar.addcategory'), icon: faUtensils },
    { to: '/add-item', label: t('navbar.additem'), icon: faUtensils },
    { to: '/admin-tables', label: t('navbar.tables'), icon: faTable },
    { to: '/admin/reservations', label: t('navbar.reservations'), icon: faListCheck },
    { to: '/AllOrders', label: t('navbar.manageorders'), icon: faReceipt },
    { to: '/inventory', label: t('navbar.inventory'), icon: faUtensils },
    { to: '/invoices', label: t('navbar.invoices'), icon: faFileInvoiceDollar },
    { to: '/Staff-Profile', label: t('navbar.staffprofile'), icon: faCalendarDays },
  ];

  const adminLinks = [
    { to: '/add-category', label: t('navbar.addcategory'), icon: faUtensils },
    { to: '/add-item', label: t('navbar.additem'), icon: faUtensils },
    { to: '/admin-tables', label: t('navbar.tables'), icon: faTable },
    { to: '/admin/reservations', label: t('navbar.reservations'), icon: faListCheck },
    { to: '/AllOrders', label: t('navbar.manageorders'), icon: faReceipt },
    { to: '/invoices', label: t('navbar.invoices'), icon: faFileInvoiceDollar },
    { to: '/AdminShifts', label: t('navbar.manageshifts'), icon: faCalendarDays },
    { to: '/ManageStaff', label: t('navbar.managestaff'), icon: faUsers },
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
          initial={{ x: isRTL ? 300 : -310, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isRTL ? 300 : -310, opacity: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 sm:w-72 bg-[#d2b48c] shadow-2xl z-50 p-4`}
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
                  {t(`navbar.${userRole}panel`)}
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
                {t("navbar.Please log in to access more features")}
              </motion.p>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
