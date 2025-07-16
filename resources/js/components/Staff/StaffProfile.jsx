import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import {
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillAlt,
  FaBriefcase
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function StaffProfile() {
  const { t } = useTranslation('staff_profile');
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchMyShifts();
  }, []);

  const fetchMyShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/shifts/my-shifts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShifts(res.data.data || []);
    } catch (err) {
      Swal.fire('Error', 'Failed to load your shifts', 'error');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#fdf6f0] to-[#fff]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#4e342e] mb-10">
          {t('staff_profile.page_title')}
        </h2>

        {shifts.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">{t('staff_profile.no_shifts')}</p>
        ) : (
          <div className="space-y-6">
            {shifts.map((shift, index) => (
              <div
                key={index}
                className="relative bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#8d6e63] hover:shadow-lg transition-all"
              >
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-[#5d4037]">{shift.name}</h3>
                </div>

                <div className="flex items-center gap-3 text-[#6d4c41] mb-2">
                  <FaCalendarAlt className="text-[#a1887f]" />
                  <span className="text-sm font-medium">
                    {t('staff_profile.date')}: {shift.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#6d4c41] mb-2">
                  <FaClock className="text-[#a1887f]" />
                  <span className="text-sm font-medium">
                    {t('staff_profile.time')}: {shift.start_time} - {shift.end_time}
                  </span>
                </div>

                
                <div className="flex flex-col gap-2 mt-3">
                  {shift.position && (
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <FaBriefcase className="text-[#a1887f]" />
                      <span className="text-sm font-medium">
                        {t('staff_profile.position')}: {shift.position}
                      </span>
                    </div>
                  )}

                  {shift.salary && (
                    <div className="flex items-center gap-2 text-[#6d4c41]">
                      <FaMoneyBillAlt className="text-[#a1887f]" />
                      <span className="text-sm font-medium">
                        {t('staff_profile.salary')}: {shift.salary} EGP
                      </span>
                    </div>
                  )}
                </div>

                {/* الزملاء */}
                <div className="flex items-start gap-3 text-[#6d4c41] mt-4">
                  <FaUsers className="text-[#a1887f] mt-1" />
                  <div>
                    <p className="text-sm font-medium mb-1">{t('staff_profile.co_workers')}:</p>
                    <ul className="list-disc ml-5 text-sm space-y-1">
                      {shift.coworkers.length > 0 ? (
                        shift.coworkers.map((c) => (
                          <li key={c.id}>
                            <span className="font-semibold">{c.name}</span>
                            {c.position && (
                              <span className="ml-2 text-[#5d4037]">
                                <FaBriefcase className="inline mr-1 text-xs text-[#a1887f]" />
                                {c.position}
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>{t('staff_profile.no_coworkers')}</li>
                      )}
                    </ul>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
