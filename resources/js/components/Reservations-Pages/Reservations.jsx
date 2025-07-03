
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reservations({ userRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin/reservations');
    } else {
      navigate('/user/reservations');
    }
  }, [userRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600 font-semibold">Redirecting to your reservations page...</p>
    </div>
  );
}