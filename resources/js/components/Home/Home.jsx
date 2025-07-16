import React, { useEffect, useState } from 'react';
import UserHome from './UserHome';
import EmployeeHome from './EmployeeHome';
import AdminHome from './AdminHome';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation(); // 🔁 إضافة الترجمة

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.role) {
      navigate('/login');
      return;
    }

    setUserRole(user.role);
    setLoading(false);
  }, [navigate]);

  if (loading) return <p className="text-center mt-10 text-gray-500">⏳ {t('loading')}</p>;

  if (userRole === 'admin') return <AdminHome />;
  if (userRole === 'employee') return <EmployeeHome />;
  return <UserHome />;
}

