import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // إضافة الترجمة

export default function Reservations({ userRole }) {
  const navigate = useNavigate();
  const { t } = useTranslation(); // استخدام الترجمة

  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin/reservations');
    } else {
      navigate('/user/reservations');
    }
  }, [userRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600 font-semibold">
        {t('reservation.redirecting')}
      </p>
    </div>
  );
}
